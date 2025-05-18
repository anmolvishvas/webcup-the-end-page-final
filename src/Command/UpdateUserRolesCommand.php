<?php

namespace App\Command;

use App\Entity\Users;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:user:update-roles',
    description: 'Updates a user\'s roles',
)]
class UpdateUserRolesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('id', InputArgument::REQUIRED, 'User ID')
            ->addArgument('roles', InputArgument::REQUIRED, 'Roles (comma-separated)');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $id = $input->getArgument('id');
        $rolesString = $input->getArgument('roles');

        $user = $this->entityManager->getRepository(Users::class)->find($id);

        if (!$user) {
            $io->error('User not found');
            return Command::FAILURE;
        }

        $roles = explode(',', $rolesString);
        $user->setRoles($roles);

        $this->entityManager->flush();

        $io->success('User roles have been updated successfully.');

        return Command::SUCCESS;
    }
} 