<?php

namespace App\Controller\Admin;

use App\Entity\Users;
use App\Entity\Medias;
use App\Entity\EndPages;
use App\Entity\Comments;
use App\Repository\UsersRepository;
use App\Repository\MediasRepository;
use App\Repository\EndPagesRepository;
use App\Repository\CommentsRepository;
use EasyCorp\Bundle\EasyAdminBundle\Config\Assets;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_ADMIN')]
#[AdminDashboard(routePath: '/admin', routeName: 'admin')]
class DashboardController extends AbstractDashboardController
{
    public function __construct(
        private AdminUrlGenerator $adminUrlGenerator,
        private UsersRepository $usersRepository,
        private MediasRepository $mediasRepository,
        private EndPagesRepository $endPagesRepository,
        private CommentsRepository $commentsRepository
    ) {
    }

    public function index(): Response
    {
        return $this->render('admin/dashboard.html.twig', [
            'counts' => [
                'users' => $this->usersRepository->count([]),
                'medias' => $this->mediasRepository->count([]),
                'endPages' => $this->endPagesRepository->count([]),
                'comments' => $this->commentsRepository->count([]),
            ]
        ]);
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('TheEndPage Admin')
            ->setFaviconPath('favicon.ico')
            ->renderContentMaximized()
            ->disableDarkMode();
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::section('Dashboard');
        yield MenuItem::linkToDashboard('Overview', 'fa fa-home');

        yield MenuItem::section('Content Management');
        yield MenuItem::linkToCrud('End Pages', 'fas fa-book', EndPages::class);
        yield MenuItem::linkToCrud('Comments', 'fas fa-comments', Comments::class);
        yield MenuItem::linkToCrud('Media', 'fas fa-image', Medias::class);

        yield MenuItem::section('User Management');
        yield MenuItem::linkToCrud('Users', 'fas fa-users', Users::class);

        yield MenuItem::section('Tools');
        yield MenuItem::linkToRoute('Back to Website', 'fas fa-arrow-left', 'app_home');
    }

    public function configureAssets(): Assets
    {
        return Assets::new()
            ->addCssFile('build/admin.css')
            ->addJsFile('build/admin.js');
    }
}
