<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\Api\AuthController;
use App\Repository\UsersRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\DBAL\Types\Types;

#[ORM\Entity(repositoryClass: UsersRepository::class)]
#[ORM\Table(name: '`user`')]
#[ApiResource(
    operations: [
        new Post(
            name: 'register',
            uriTemplate: '/register',
            controller: AuthController::class,
        ),
        new GetCollection(),
    ],
)]
class Users implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    private ?string $lastname = null;

    #[ORM\Column(length: 255)]
    private ?string $username = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?bool $isActive = null;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\Column(type: Types::INTEGER, options: ["default" => 3])]
    private int $count_attempt = 3;

    /**
     * @var Collection<int, EndPages>
     */
    #[ORM\OneToMany(targetEntity: EndPages::class, mappedBy: 'user')]
    private Collection $endPages;

    public function __construct()
    {
        $this->endPages = new ArrayCollection();
        $this->count_attempt = 3;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function eraseCredentials(): void {}

    public function __toString(): string
    {
        return $this->firstname . ' ' . $this->lastname;
    }

    /**
     * @return Collection<int, EndPages>
     */
    public function getEndPages(): Collection
    {
        return $this->endPages;
    }

    public function addEndPage(EndPages $endPage): static
    {
        if (!$this->endPages->contains($endPage)) {
            $this->endPages->add($endPage);
            $endPage->setUser($this);
        }

        return $this;
    }

    public function removeEndPage(EndPages $endPage): static
    {
        if ($this->endPages->removeElement($endPage)) {
            if ($endPage->getUser() === $this) {
                $endPage->setUser(null);
            }
        }

        return $this;
    }

    public function getCountAttempt(): int
    {
        return $this->count_attempt;
    }

    public function setCountAttempt(int $count_attempt): static
    {
        $this->count_attempt = $count_attempt;
        return $this;
    }

    public function decrementCountAttempt(): static
    {
        if ($this->count_attempt > 0) {
            $this->count_attempt--;
            if ($this->count_attempt === 0) {
                $this->isActive = false;
            }
        }
        return $this;
    }

    public function resetCountAttempt(): static
    {
        $this->count_attempt = 3;
        return $this;
    }

    public function hasAttemptsLeft(): bool
    {
        return $this->count_attempt > 0;
    }
}
