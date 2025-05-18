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
            TextField::new('title'),
            TextareaField::new('content')->setNumOfRows(10),
            ChoiceField::new('tone')
                ->setChoices([
                    'Dramatic' => Tone::Dramatic,
                    'Ironic' => Tone::Ironic,
                    'Ultra Cringe' => Tone::UltraCringe,
                    'Classy' => Tone::Classy,
                    'Touching' => Tone::Touching,
                    'Absurd' => Tone::Absurd,
                    'Passive Aggressive' => Tone::PassiveAggressive,
                    'Honest' => Tone::Honest,
                ]),
            TextField::new('backgroundType'),
            TextField::new('backgroundValue'),
            BooleanField::new('isPrivate'),
            AssociationField::new('user'),
            CollectionField::new('comments')->onlyOnDetail(),
            CollectionField::new('medias')->onlyOnDetail(),
            DateTimeField::new('createdAt')->hideOnForm(),
        ];
    }
}
