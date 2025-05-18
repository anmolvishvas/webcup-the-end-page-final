<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\CommentsRepository;
use App\State\Provider\CommentProvider;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CommentsRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/end_pages/{endPageId}/comments',
            uriVariables: [
                'endPageId' => [
                    'from_class' => EndPages::class,
                    'identifier_name' => 'id'
                ]
            ],
            provider: CommentProvider::class,
            normalizationContext: ['groups' => ['comment:read']]
        )
    ]
)]
class Comments
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['comment:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'comments')]
    #[Groups(['comment:read'])]
    private ?EndPages $end_page = null;

    #[ORM\Column(length: 255)]
    #[Groups(['comment:read'])]
    private ?string $author = null;

    #[ORM\Column(length: 255)]
    #[Groups(['comment:read'])]
    private ?string $text = null;

    #[ORM\Column]
    #[Groups(['comment:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEndPage(): ?EndPages
    {
        return $this->end_page;
    }

    public function setEndPage(?EndPages $end_page): static
    {
        $this->end_page = $end_page;

        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(string $author): static
    {
        $this->author = $author;

        return $this;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): static
    {
        $this->text = $text;

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

    public function __toString(): string
    {
        return sprintf('Comment by %s: %s', $this->author, substr($this->text, 0, 30) . (strlen($this->text) > 30 ? '...' : ''));
    }
}
