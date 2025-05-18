<?php

namespace App\Controller\Admin;

use App\Entity\Medias;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;

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
            AssociationField::new('end_pages'),
            TextField::new('media_type'),
            TextField::new('url'),
            TextField::new('original_filename'),
            NumberField::new('file_size'),
            DateTimeField::new('createdAt')->hideOnForm(),
            ImageField::new('url')
                ->setBasePath('/uploads')
                ->onlyOnIndex(),
        ];
    }
} 