<?php

namespace App\Controller;

use App\Entity\EndPages;
use App\Entity\Medias;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class MediaUploadController extends AbstractController
{
    private $fileUploader;
    private $entityManager;

    public function __construct(FileUploader $fileUploader, EntityManagerInterface $entityManager)
    {
        $this->fileUploader = $fileUploader;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/end_pages/{id}/upload', name: 'upload_media', methods: ['POST'])]
    public function uploadMedia(Request $request, EndPages $endPage): Response
    {
        $debug = [
            'files_received' => $request->files->count(),
            'request_method' => $request->getMethod(),
            'content_type' => $request->headers->get('Content-Type'),
        ];

        if (!$request->files->has('files')) {
            return $this->json([
                'error' => 'No files field in request',
                'debug' => $debug
            ], Response::HTTP_BAD_REQUEST);
        }

        $uploadedFiles = $request->files->get('files');
        
        if (empty($uploadedFiles)) {
            return $this->json([
                'error' => 'No files uploaded',
                'debug' => $debug
            ], Response::HTTP_BAD_REQUEST);
        }

        $uploadedMedias = [];
        $errors = [];

        foreach ($uploadedFiles as $uploadedFile) {
            try {
                if (!($uploadedFile instanceof UploadedFile)) {
                    $errors[] = 'Invalid file upload object';
                    continue;
                }

                // Basic file checks
                if (!$uploadedFile->isValid()) {
                    $errors[] = sprintf('File upload error: %s', $uploadedFile->getErrorMessage());
                    continue;
                }

                if (!file_exists($uploadedFile->getPathname())) {
                    $errors[] = 'Temporary file does not exist';
                    continue;
                }

                if (!is_readable($uploadedFile->getPathname())) {
                    $errors[] = 'Temporary file is not readable';
                    continue;
                }

                // Check file type
                $mimeType = $uploadedFile->getMimeType() ?? $uploadedFile->getClientMimeType();
                $allowedTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'video/mp4',
                    'audio/mpeg',
                    'audio/ogg',
                    'audio/wav'
                ];

                if (!in_array($mimeType, $allowedTypes)) {
                    $errors[] = sprintf('File type %s is not allowed', $mimeType);
                    continue;
                }

                $fileSize = 0;
                try {
                    $fileSize = $uploadedFile->getSize();
                } catch (\Exception $e) {
                    $fileSize = filesize($uploadedFile->getPathname());
                }

                if ($fileSize === 0 || $fileSize === false) {
                    $errors[] = 'Could not determine file size';
                    continue;
                }

                $fileName = $this->fileUploader->upload($uploadedFile);
                
                $media = new Medias();
                $media->setEndPages($endPage);
                $media->setMediaType($mimeType);
                $media->setUrl($fileName);
                $media->setOriginalFilename($uploadedFile->getClientOriginalName());
                $media->setFileSize($fileSize);
                $media->setCreatedAt(new \DateTimeImmutable());

                $this->entityManager->persist($media);
                
                $uploadedMedias[] = [
                    'originalName' => $uploadedFile->getClientOriginalName(),
                    'fileName' => $fileName,
                    'mimeType' => $mimeType,
                    'size' => $fileSize,
                    'tempPath' => $uploadedFile->getPathname()
                ];
            } catch (\Exception $e) {
                $errors[] = $e->getMessage();
            }
        }

        $this->entityManager->flush();

        return $this->json([
            'message' => !empty($uploadedMedias) ? 'Files uploaded successfully' : 'No files were uploaded',
            'files' => $uploadedMedias,
            'errors' => $errors,
            'debug' => $debug
        ], !empty($uploadedMedias) ? Response::HTTP_CREATED : Response::HTTP_BAD_REQUEST);
    }
} 