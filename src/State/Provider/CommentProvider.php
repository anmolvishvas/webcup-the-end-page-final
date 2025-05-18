<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\CommentsRepository;

class CommentProvider implements ProviderInterface
{
    public function __construct(
        private CommentsRepository $commentsRepository
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        // Get the end page ID from the URI variables
        $endPageId = $uriVariables['endPageId'] ?? null;

        if (!$endPageId) {
            throw new \InvalidArgumentException('End page ID is required');
        }

        // Fetch comments for the specified end page
        return $this->commentsRepository->findBy(['end_page' => $endPageId], ['createdAt' => 'DESC']);
    }
} 