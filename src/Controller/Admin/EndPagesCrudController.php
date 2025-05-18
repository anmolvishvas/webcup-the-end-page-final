<?php

namespace App\Controller\Admin;

use App\Entity\EndPages;
use App\Enum\Tone;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;

class EndPagesCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return EndPages::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            TextField::new('uuid')->hideOnForm(),
            AssociationField::new('user'),
            TextField::new('title'),
            TextareaField::new('content'),
            ChoiceField::new('tone')->setChoices([
                'Dramatic' => 'dramatic',
                'Ironic' => 'ironic',
                'Absurd' => 'absurd',
                'Honest' => 'honest',
                'Passive-Aggressive' => 'passive-aggressive',
                'Ultra-Cringe' => 'ultra-cringe',
                'Classe' => 'classe',
                'Touchant' => 'touchant'
            ]),
            TextField::new('background_type'),
            TextField::new('background_value'),
            DateTimeField::new('createdAt')->hideOnForm(),
            BooleanField::new('isPrivate'),
            NumberField::new('totalRating')->hideOnForm(),
            NumberField::new('numberOfVotes')->hideOnForm(),
            NumberField::new('averageRating')->hideOnForm(),
            AssociationField::new('medias'),
            AssociationField::new('comments'),
        ];
    }
}
