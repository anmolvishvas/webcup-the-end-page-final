<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Psr\Log\LoggerInterface;

#[AsCommand(
    name: 'app:test-email',
    description: 'Test email sending functionality',
)]
class TestEmailCommand extends Command
{
    public function __construct(
        private MailerInterface $mailer,
        private LoggerInterface $logger
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED, 'Email address to send test to');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $emailAddress = $input->getArgument('email');

        try {
            $output->writeln('Attempting to send test email...');

            $email = (new Email())
                ->from('no-reply@theendpage.com')
                ->to($emailAddress)
                ->subject('Test Email from The End Page')
                ->text('This is a test email from The End Page application.');

            $this->mailer->send($email);

            $output->writeln('Email sent successfully!');
            $this->logger->info('Test email sent successfully', ['to' => $emailAddress]);

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $output->writeln('Failed to send email: ' . $e->getMessage());
            $this->logger->error('Failed to send test email', [
                'to' => $emailAddress,
                'error' => $e->getMessage()
            ]);

            return Command::FAILURE;
        }
    }
} 