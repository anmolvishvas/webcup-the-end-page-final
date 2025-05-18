<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250518010000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Fix roles column to use JSON type';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE `user` MODIFY roles JSON NOT NULL');
        $this->addSql('UPDATE `user` SET roles = \'[]\' WHERE roles IS NULL OR roles = \'\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE `user` MODIFY roles LONGTEXT NOT NULL');
    }
} 