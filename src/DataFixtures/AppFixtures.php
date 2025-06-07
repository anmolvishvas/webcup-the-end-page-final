<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\Users;
use App\Entity\EndPages;
use App\Entity\Comments;
use App\Entity\Medias;
use App\Enum\Tone;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;
    private array $references = [];

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    private function generateDate(string $dateString): \DateTimeImmutable
    {
        // Handle Alice's date syntax
        if (preg_match('/<dateTimeBetween\("([^"]+)", "([^"]+)"\)>/', $dateString, $matches)) {
            $start = new \DateTime($matches[1]);
            $end = new \DateTime($matches[2]);
            $timestamp = mt_rand($start->getTimestamp(), $end->getTimestamp());
            return new \DateTimeImmutable('@' . $timestamp);
        }
        return new \DateTimeImmutable($dateString);
    }

    private function getToneValue(mixed $value): Tone
    {
        if (is_string($value) && str_starts_with($value, '!php/const App\\Enum\\Tone::')) {
            $toneName = substr($value, strlen('!php/const App\\Enum\\Tone::'));
            return match ($toneName) {
                'Dramatic' => Tone::DRAMATIC,
                'Ironic' => Tone::IRONIC,
                'UltraCringe' => Tone::ULTRA_CRINGE,
                'Classy' => Tone::CLASSE,
                'Touching' => Tone::TOUCHANT,
                'Absurd' => Tone::ABSURD,
                'PassiveAggressive' => Tone::PASSIVE_AGGRESSIVE,
                'Honest' => Tone::HONEST,
                default => Tone::DRAMATIC // Default to dramatic if unknown
            };
        }
        // If not using PHP constant syntax, try to use the value directly
        return Tone::from(strtolower($value));
    }

    private function addRef(string $name, object $object): void
    {
        $this->references[$name] = $object;
    }

    private function getRef(string $name): ?object
    {
        return $this->references[$name] ?? null;
    }

    public function load(ObjectManager $manager): void
    {
        // Load users first
        $usersData = Yaml::parseFile(__DIR__ . '/../../fixtures/users.yaml');
        error_log("Loading users...");

        foreach ($usersData['App\\Entity\\Users'] as $reference => $userData) {
            $user = new Users();
            $validUser = true;
            foreach ($userData as $property => $value) {
                $setter = 'set' . ucfirst($property);
                if (method_exists($user, $setter)) {
                    if ($property === 'password') {
                        $value = $this->passwordHasher->hashPassword($user, $value);
                    } elseif ($property === 'createdAt') {
                        $value = $this->generateDate($value);
                    } elseif ($property === 'roles' && is_string($value)) {
                        $value = [$value];
                    }
                    $user->$setter($value);
                }
            }
            if ($validUser) {
                $manager->persist($user);
                $this->addRef($reference, $user);
                error_log("Added user reference: {$reference}");
            }
        }

        // Flush users first
        $manager->flush();
        error_log("Users flushed to database");

        // Load end pages
        $endPagesData = Yaml::parseFile(__DIR__ . '/../../fixtures/end_pages.yaml');
        error_log("Loading end pages...");

        // Create and persist all end pages
        foreach ($endPagesData['App\\Entity\\EndPages'] as $reference => $pageData) {
            error_log("Processing end page: {$reference}");
            $endPage = new EndPages();
            $validEndPage = true;

            // Set UUID first if it's not already set
            if (!$endPage->getUuid()) {
                $endPage->__construct(); // This will set the UUID
            }

            foreach ($pageData as $property => $value) {
                $setter = 'set' . ucfirst($property);
                if (method_exists($endPage, $setter)) {
                    if ($property === 'user' && str_starts_with($value, '@')) {
                        $userRef = substr($value, 1);
                        $user = $this->getRef($userRef);
                        if (!$user) {
                            error_log("  ERROR: User reference not found: {$userRef}");
                            $validEndPage = false;
                            break;
                        }
                        $value = $user;
                        error_log("  Set user reference: {$userRef}");
                    } elseif ($property === 'tone') {
                        try {
                            $value = $this->getToneValue($value);
                        } catch (\ValueError $e) {
                            error_log("Invalid tone value: $value, using default");
                            $value = Tone::DRAMATIC;
                        }
                    } elseif ($property === 'createdAt') {
                        $value = $this->generateDate($value);
                    }
                    $endPage->$setter($value);
                }
            }

            if ($validEndPage) {
                $manager->persist($endPage);
                $this->addRef($reference, $endPage);
                error_log("Added end page reference: {$reference}");
            } else {
                error_log("  Skipping invalid end page: {$reference}");
            }
        }

        // Flush end pages before processing comments
        $manager->flush();
        error_log("End pages flushed to database");

        // Load comments
        if (file_exists(__DIR__ . '/../../fixtures/comments.yaml')) {
            $commentsData = Yaml::parseFile(__DIR__ . '/../../fixtures/comments.yaml');
            error_log("Loading comments...");

            foreach ($commentsData['App\\Entity\\Comments'] ?? [] as $reference => $commentData) {
                error_log("Processing comment: {$reference}");
                $comment = new Comments();
                $validComment = true;
                $endPageRef = null;

                foreach ($commentData as $property => $value) {
                    $setter = 'set' . ucfirst($property);
                    if (method_exists($comment, $setter)) {
                        if ($property === 'end_page' && str_starts_with($value, '@')) {
                            $pageRef = substr($value, 1);
                            $endPageRef = $pageRef; // Store for later validation
                            $endPage = $this->getRef($pageRef);
                            if (!$endPage) {
                                error_log("  ERROR: End page reference not found: {$pageRef}");
                                $validComment = false;
                                break;
                            }
                            $value = $endPage;
                            error_log("  Set end page reference: {$pageRef} (ID: " . $endPage->getId() . ")");
                        } elseif ($property === 'createdAt') {
                            $value = $this->generateDate($value);
                        }
                        $comment->$setter($value);
                    }
                }

                // Verify the comment is valid and has required references
                if ($validComment && $comment->getEndPage()) {
                    $manager->persist($comment);
                    error_log("  Persisted comment: {$reference} -> " . $endPageRef);
                } else {
                    error_log("  Skipping invalid comment: {$reference}");
                }
            }

            // Final flush for comments
            $manager->flush();
            error_log("Comments flushed to database");
        }
    }
}
