<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250517190443 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE end_pages ADD uuid BINARY(16) NOT NULL COMMENT '(DC2Type:uuid)', ADD is_private TINYINT(1) DEFAULT 0 NOT NULL, ADD total_rating INT DEFAULT 0 NOT NULL, ADD number_of_votes INT DEFAULT 0 NOT NULL, ADD average_rating DOUBLE PRECISION DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_51EBA270D17F50A6 ON end_pages (uuid)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            DROP INDEX UNIQ_51EBA270D17F50A6 ON end_pages
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE end_pages DROP uuid, DROP is_private, DROP total_rating, DROP number_of_votes, DROP average_rating
        SQL);
    }
}
