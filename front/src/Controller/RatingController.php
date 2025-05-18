<?php

namespace App\Controller;

use App\Entity\EndPages;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class RatingController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/end_pages/{uuid}/rating', name: 'add_rating', methods: ['PUT'])]
    public function addRating(Request $request, string $uuid): Response
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['rating']) || !is_numeric($data['rating'])) {
            throw new BadRequestHttpException('Rating value is required and must be numeric');
        }

        $rating = (int) $data['rating'];

        if ($rating < 1 || $rating > 5) {
            throw new BadRequestHttpException('Rating must be between 1 and 5');
        }

        $endPage = $this->entityManager->getRepository(EndPages::class)->findOneBy(['uuid' => $uuid]);

        if (!$endPage) {
            throw new NotFoundHttpException('EndPage not found');
        }

        $endPage->addRating($rating);

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Rating added successfully',
            'endPage' => [
                'id' => $endPage->getId(),
                'totalRating' => $endPage->getTotalRating(),
                'numberOfVotes' => $endPage->getNumberOfVotes(),
                'averageRating' => $endPage->getAverageRating()
            ]
        ]);
    }
} 