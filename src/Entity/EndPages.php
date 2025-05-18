<?php

namespace App\Entity;

use App\Enum\Tone;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\EndPagesRepository;
use App\State\Processor\EndPageProcessor;
use App\State\Provider\EndPageProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\ApiProperty;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: EndPagesRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Post(
            processor: EndPageProcessor::class,
            validationContext: ['groups' => ['Default']],
            normalizationContext: ['groups' => ['endpage:read', 'media:read']]
        ),
        new Get(
            uriTemplate: '/end_pages/{uuid}',
            provider: EndPageProvider::class,
            uriVariables: ['uuid' => ['from_class' => EndPages::class]],
            normalizationContext: ['groups' => ['endpage:read', 'media:read']]
        ),
        new GetCollection(
            normalizationContext: ['groups' => ['endpage:read', 'media:read']]
        ),
        new GetCollection(
            uriTemplate: '/users/{userId}/end_pages',
            uriVariables: [
                'userId' => [
                    'from_class' => Users::class,
                    'identifier_name' => 'id'
                ]
            ],
            provider: EndPageProvider::class,
            normalizationContext: ['groups' => ['endpage:read', 'media:read']]
        ),
        new Put(
            processor: EndPageProcessor::class,
            normalizationContext: ['groups' => ['endpage:read', 'media:read']]
        ),
        new Delete()
    ]
)]
class EndPages
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[ApiProperty(identifier: false)]
    #[Groups(['endpage:read'])]
    private ?int $id = null;

    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ApiProperty(identifier: true)]
    #[Groups(['endpage:read'])]
    private ?Uuid $uuid = null;

    #[ORM\ManyToOne(inversedBy: 'endPages')]
    #[Groups(['endpage:read'])]
    private ?Users $user = null;

    #[ORM\Column(length: 255)]
    #[Groups(['endpage:read'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['endpage:read'])]
    private ?string $content = null;

    #[ORM\Column(enumType: Tone::class)]
    #[Groups(['endpage:read'])]
    private ?Tone $tone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['endpage:read'])]
    private ?string $background_type = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['endpage:read'])]
    private ?string $background_value = null;

    #[ORM\Column]
    #[Groups(['endpage:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(options: ["default" => false])]
    #[Groups(['endpage:read'])]
    #[ApiProperty(description: 'Whether the end page is private')]
    private bool $isPrivate = false;

    #[ORM\Column(type: Types::INTEGER, options: ["default" => 0])]
    #[Groups(['endpage:read'])]
    private int $totalRating = 0;

    #[ORM\Column(type: Types::INTEGER, options: ["default" => 0])]
    #[Groups(['endpage:read'])]
    private int $numberOfVotes = 0;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    #[Groups(['endpage:read'])]
    private ?float $averageRating = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Assert\All([
        new Assert\Email(message: "The email '{{ value }}' is not a valid email.")
    ])]
    #[Groups(['endpage:read'])]
    private ?array $emails = null;

    /**
     * @var Collection<int, Medias>
     */
    #[ORM\OneToMany(targetEntity: Medias::class, mappedBy: 'end_pages')]
    #[Groups(['endpage:read'])]
    private Collection $medias;

    /**
     * @var Collection<int, Comments>
     */
    #[ORM\OneToMany(targetEntity: Comments::class, mappedBy: 'end_page')]
    #[Groups(['endpage:read'])]
    private Collection $comments;

    public function __construct()
    {
        $this->uuid = Uuid::v4();
        $this->medias = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->emails = null;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function updateAverageRating(): void
    {
        if ($this->numberOfVotes > 0) {
            $this->averageRating = $this->totalRating / $this->numberOfVotes;
        } else {
            $this->averageRating = null;
        }
    }

    public function addRating(int $rating): self
    {
        $this->totalRating += $rating;
        $this->numberOfVotes++;
        $this->updateAverageRating();
        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUuid(): ?Uuid
    {
        return $this->uuid;
    }

    public function getUser(): ?Users
    {
        return $this->user;
    }

    public function setUser(?Users $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;
        return $this;
    }

    public function getTone(): ?Tone
    {
        return $this->tone;
    }

    public function setTone(?Tone $tone): static
    {
        $this->tone = $tone;
        return $this;
    }

    public function getBackgroundType(): ?string
    {
        return $this->background_type;
    }

    public function setBackgroundType(?string $background_type): static
    {
        $this->background_type = $background_type;
        return $this;
    }

    public function getBackgroundValue(): ?string
    {
        return $this->background_value;
    }

    public function setBackgroundValue(?string $background_value): static
    {
        $this->background_value = $background_value;
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

    public function getIsPrivate(): bool
    {
        return $this->isPrivate;
    }

    public function setIsPrivate(bool $isPrivate): static
    {
        $this->isPrivate = $isPrivate;
        return $this;
    }

    public function getTotalRating(): int
    {
        return $this->totalRating;
    }

    public function setTotalRating(int $totalRating): static
    {
        $this->totalRating = $totalRating;
        $this->updateAverageRating();
        return $this;
    }

    public function getNumberOfVotes(): int
    {
        return $this->numberOfVotes;
    }

    public function setNumberOfVotes(int $numberOfVotes): static
    {
        $this->numberOfVotes = $numberOfVotes;
        $this->updateAverageRating();
        return $this;
    }

    public function getAverageRating(): ?float
    {
        return $this->averageRating;
    }

    public function getEmails(): ?array
    {
        return $this->emails;
    }

    public function setEmails(?array $emails): static
    {
        $this->emails = $emails;
        if ($this->emails !== null) {
            $this->emails = array_values(array_filter($this->emails, fn($email) => $email && is_string($email)));
        }
        return $this;
    }

    public function addEmail(string $email): static
    {
        if ($this->emails === null) {
            $this->emails = [];
        }
        if (!in_array($email, $this->emails, true)) {
            $this->emails[] = $email;
        }
        return $this;
    }

    public function removeEmail(string $email): static
    {
        if ($this->emails === null) {
            return $this;
        }
        $key = array_search($email, $this->emails, true);
        if ($key !== false) {
            unset($this->emails[$key]);
            $this->emails = array_values($this->emails);
        }
        return $this;
    }

    /**
     * @return Collection<int, Medias>
     */
    public function getMedias(): Collection
    {
        return $this->medias;
    }

    public function addMedia(Medias $media): static
    {
        if (!$this->medias->contains($media)) {
            $this->medias->add($media);
            $media->setEndPages($this);
        }
        return $this;
    }

    public function removeMedia(Medias $media): static
    {
        if ($this->medias->removeElement($media)) {
            if ($media->getEndPages() === $this) {
                $media->setEndPages(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Comments>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comments $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setEndPage($this);
        }
        return $this;
    }

    public function removeComment(Comments $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            if ($comment->getEndPage() === $this) {
                $comment->setEndPage(null);
            }
        }
        return $this;
    }
}
