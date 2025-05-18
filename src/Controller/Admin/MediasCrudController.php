<?php

namespace App\Controller\Admin;

use App\Entity\Medias;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\UrlField;

class MediasCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Medias::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            ChoiceField::new('mediaType')->setChoices([
                'Image' => 'image',
                'Video' => 'video',
                'Audio' => 'audio',
            ]),
            UrlField::new('url'),
            AssociationField::new('end_pages'),
            DateTimeField::new('createdAt')->hideOnForm(),
        ];
    }
} 