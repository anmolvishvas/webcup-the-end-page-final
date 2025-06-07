<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MediasRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;

#[ORM\Entity(repositoryClass: MediasRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['media:read']]
)]
#[ORM\HasLifecycleCallbacks]
class Medias
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'medias')]
    private ?EndPages $end_pages = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media:read', 'endpage:read'])]
    private ?string $media_type = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media:read', 'endpage:read'])]
    private ?string $url = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media:read'])]
    private ?string $original_filename = null;

    #[ORM\Column]
    #[Groups(['media:read'])]
    private ?int $file_size = null;

    #[ORM\Column]
    #[Groups(['media:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    private ?File $file = null;

    #[Assert\NotBlank(message: 'Please upload a file')]
    #[Assert\File(
        maxSize: '100M',
        mimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'video/mp4',
            'audio/mpeg',
            'audio/ogg',
            'audio/wav'
        ],
        mimeTypesMessage: 'Please upload a valid file type (jpeg, png, gif, mp4, mp3, ogg, wav)'
    )]
    private $uploadedFile;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEndPages(): ?EndPages
    {
        return $this->end_pages;
    }

    public function setEndPages(?EndPages $end_pages): static
    {
        $this->end_pages = $end_pages;
        return $this;
    }

    public function getMediaType(): ?string
    {
        return $this->media_type;
    }

    public function setMediaType(string $media_type): static
    {
        $this->media_type = $media_type;
        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): static
    {
        $this->url = $url;
        return $this;
    }

    public function getOriginalFilename(): ?string
    {
        return $this->original_filename;
    }

    public function setOriginalFilename(string $original_filename): static
    {
        $this->original_filename = $original_filename;
        return $this;
    }

    public function getFileSize(): ?int
    {
        return $this->file_size;
    }

    public function setFileSize(int $file_size): static
    {
        $this->file_size = $file_size;
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

    public function getFile(): ?File
    {
        return $this->file;
    }

    public function setFile(?File $file): static
    {
        $this->file = $file;
        return $this;
    }

    public function getUploadedFile()
    {
        return $this->uploadedFile;
    }

    public function setUploadedFile($uploadedFile): static
    {
        $this->uploadedFile = $uploadedFile;
        return $this;
    }

    #[Groups(['media:read', 'endpage:read'])]
    #[SerializedName('full_url')]
    public function getFullUrl(): string
    {
        // return 'https://lrsquoescouad.maurice.webcup.hodi.host/webcup-the-end-page-final/public/uploads/' . $this->url;
        return 'https://theendpage.devanmol.tech/uploads/' . $this->url;
        // return 'http://localhost/theEndPage_Webcup/public/uploads/' . $this->url;
    }

    public function __toString(): string
    {
        return $this->original_filename ?? 'Unknown Media';
    }
}
