<?php

namespace App\Controller;

use App\Entity\EndPages;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Uid\Uuid;

class EndPageViewController extends AbstractController
{
    #[Route('/end_pages/{uuid}', name: 'app_end_page_view', methods: ['GET'])]
    public function view(string $uuid, EntityManagerInterface $entityManager): Response
    {
        $endPage = $entityManager->getRepository(EndPages::class)
            ->findOneBy(['uuid' => Uuid::fromString($uuid)]);

        if (!$endPage) {
            throw new NotFoundHttpException('End Page not found');
        }

        return $this->json([
            'id' => $endPage->getId(),
            'uuid' => $endPage->getUuid(),
            'title' => $endPage->getTitle(),
            'content' => $endPage->getContent(),
            'tone' => $endPage->getTone(),
            'background_type' => $endPage->getBackgroundType(),
            'background_value' => $endPage->getBackgroundValue(),
            'createdAt' => $endPage->getCreatedAt()->format('Y-m-d H:i:s'),
            'isPrivate' => $endPage->isPrivate(),
            'averageRating' => $endPage->getAverageRating()
        ]);
    }
} 