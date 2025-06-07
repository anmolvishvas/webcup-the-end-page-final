<?php

namespace App\Controller\Api;

use App\Entity\Users;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[Route('/api')]
class AuthController extends AbstractController
{
    public function __construct(
        private readonly FileUploader $fileUploader
    ) {}

    public function __invoke(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        MailerInterface $mailer,
        JWTTokenManagerInterface $jwtManager,
    ): Response {
        $data = json_decode($request->getContent(), true);

        $user = new Users();
        $user->setFirstname($data['firstname']);
        $user->setLastname($data['lastname']);
        $user->setUsername($data['username']);
        $user->setEmail($data['email']);
        $user->setCreatedAt(new \DateTimeImmutable('now'));
        $user->setIsActive(true);
        $user->setCountAttempt(3);

        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);
        
        $entityManager->persist($user);
        $entityManager->flush();

        $email = (new Email())
            ->from('anmol@theendpage.devanmol.tech')
            ->to($user->getEmail())
            ->subject('Welcome to Our Platform')
            ->text(sprintf(
                'Hello %s, you have successfully registered to our The End.Page Platform! You have %d attempts available.',
                $user->getFirstName(),
                $user->getCountAttempt()
            ));

        $mailer->send($email);

        $token = $jwtManager->create($user);

        return $this->json([
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'count_attempt' => $user->getCountAttempt()
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/attempts/{id}', name: 'decrement_attempts', methods: ['PUT'])]
    public function decrementAttempts(
        int $id,
        EntityManagerInterface $entityManager,
    ): Response {
        $user = $entityManager->getRepository(Users::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $user->decrementCountAttempt();
        $entityManager->flush();

        return $this->json([
            'attempts_left' => $user->getCountAttempt(),
            'has_attempts' => $user->hasAttemptsLeft()
        ]);
    }
}
