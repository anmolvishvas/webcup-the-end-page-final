<?php

namespace App\Controller\Api;

use App\Entity\Users;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LoginController extends AbstractController
{
    #[Route('/api/auth/login_check', name: 'login_check', methods: ['POST'])]
    public function login(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Email and password are required.'], 400);
        }

        $user = $em->getRepository(Users::class)->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['error' => 'Invalid credentials.'], 401);
        }

        // Check if account is active
        if (!$user->isActive()) {
            return new JsonResponse([
                'error' => 'Account is deactivated due to too many failed attempts. Please contact support.',
                'is_active' => false
            ], 401);
        }

        // Check if user has attempts left
        if (!$user->hasAttemptsLeft()) {
            return new JsonResponse([
                'error' => 'No login attempts remaining. Account will be deactivated.',
                'attempts_left' => 0
            ], 401);
        }

        // Verify password
        if (!$passwordHasher->isPasswordValid($user, $password)) {
            // Decrement attempts and save
            $user->decrementCountAttempt();
            $em->flush();

            return new JsonResponse([
                'error' => 'Invalid credentials.',
                'attempts_left' => $user->getCountAttempt(),
                'is_active' => $user->isActive()
            ], 401);
        }

        // Successful login - reset attempts
        $user->resetCountAttempt();
        $em->flush();

        $token = $jwtManager->create($user);

        return new JsonResponse([
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
                'is_active' => $user->isActive(),
                'attempts_left' => $user->getCountAttempt()
            ],
        ]);
    }
}
