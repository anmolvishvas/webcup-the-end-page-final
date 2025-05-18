<?php

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\EndPages;
use App\Service\EndPageMailer;
use Doctrine\ORM\EntityManagerInterface;

final class EndPageProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly ProcessorInterface $persistProcessor,
        private readonly EndPageMailer $endPageMailer,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): EndPages
    {
        /** @var EndPages $result */
        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        $this->endPageMailer->sendNewEndPageNotification($result);

        return $result;
    }
} 