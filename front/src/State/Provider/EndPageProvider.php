<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\EndPages;
use App\Repository\EndPagesRepository;
use App\Repository\UsersRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Psr\Log\LoggerInterface;

class EndPageProvider implements ProviderInterface
{
    public function __construct(
        private EndPagesRepository $endPagesRepository,
        private UsersRepository $usersRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly ProviderInterface $itemProvider,
        private readonly LoggerInterface $logger
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        // If we have a userId in the URL, return collection for that user
        if (isset($uriVariables['userId'])) {
            $user = $this->usersRepository->find($uriVariables['userId']);
            if (!$user) {
                throw new \Exception('User not found');
            }
            return $this->endPagesRepository->findBy(['user' => $user], ['createdAt' => 'DESC']);
        }

        // If we have a uuid, return single EndPage
        if (isset($uriVariables['uuid'])) {
            $this->logger->info('Attempting to find EndPage by UUID', [
                'uuid' => $uriVariables['uuid'],
                'uriVariables' => $uriVariables,
                'operation' => $operation->getName()
            ]);

            try {
                $uuid = Uuid::fromString($uriVariables['uuid']);
                $this->logger->info('UUID parsed successfully', ['uuid_object' => $uuid->toRfc4122()]);
                
                $endPage = $this->entityManager->getRepository(EndPages::class)
                    ->findOneBy(['uuid' => $uuid]);
                
                if (!$endPage) {
                    $this->logger->warning('EndPage not found for UUID', ['uuid' => $uuid->toRfc4122()]);
                    throw new NotFoundHttpException('EndPage not found');
                }
                
                $this->logger->info('EndPage found successfully', [
                    'uuid' => $uuid->toRfc4122(),
                    'endPageId' => $endPage->getId()
                ]);
                
                return $endPage;
            } catch (\InvalidArgumentException $e) {
                $this->logger->error('Invalid UUID format', [
                    'uuid' => $uriVariables['uuid'],
                    'error' => $e->getMessage()
                ]);
                throw new NotFoundHttpException('Invalid UUID format: ' . $e->getMessage());
            }
        }

        // Default collection
        return $this->endPagesRepository->findAll();
    }
} 