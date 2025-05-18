<?php

namespace App\Service;

use App\Entity\EndPages;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class EndPageMailer
{
    private MailerInterface $mailer;
    private UrlGeneratorInterface $urlGenerator;
    private LoggerInterface $logger;

    public function __construct(
        MailerInterface $mailer,
        UrlGeneratorInterface $urlGenerator,
        LoggerInterface $logger
    ) {
        $this->mailer = $mailer;
        $this->urlGenerator = $urlGenerator;
        $this->logger = $logger;
    }

    public function sendNewEndPageNotification(EndPages $endPage): void
    {
        $emails = $endPage->getEmails();
        if ($emails === null || empty($emails)) {
            $this->logger->info('No emails to send notification to', [
                'endPageId' => $endPage->getId(),
                'endPageTitle' => $endPage->getTitle()
            ]);
            return;
        }

        $subject = sprintf('New End Page: %s', $endPage->getTitle());

        $url = $this->urlGenerator->generate(
            'app_end_page_view',
            ['uuid' => $endPage->getUuid()],
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        $emailContent = $this->createEmailContent($endPage, $url);

        foreach ($emails as $emailAddress) {
            if (!filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
                $this->logger->warning('Invalid email address', [
                    'email' => $emailAddress,
                    'endPageId' => $endPage->getId()
                ]);
                continue;
            }

            $this->sendEmail($emailAddress, $subject, $emailContent, $endPage->getId());
        }
    }

    private function createEmailContent(EndPages $endPage, string $url): string
    {
        return sprintf(
            "Hello,\n\n" .
                "A new End Page has been created: %s\n\n" .
                "Title: %s\n" .
                "You can view it here: %s\n\n" .
                "Best regards,\n" .
                "The End Page Team",
            $endPage->getTitle(),
            $endPage->getTitle(),
            $url
        );
    }

    private function sendEmail(string $emailAddress, string $subject, string $content, ?int $endPageId): void
    {
        try {
            $this->logger->info('Sending email', [
                'to' => $emailAddress,
                'endPageId' => $endPageId
            ]);

            $email = (new Email())
                ->from('no-reply@theendpage.com')
                ->to($emailAddress)
                ->subject($subject)
                ->text($content);

            $this->mailer->send($email);

            $this->logger->info('Email sent successfully', [
                'to' => $emailAddress,
                'endPageId' => $endPageId
            ]);
        } catch (TransportExceptionInterface $e) {
            $this->logger->error('Failed to send email', [
                'to' => $emailAddress,
                'endPageId' => $endPageId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
