<?php


namespace App\Controller;


use App\Repository\ReservationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Contact;
use App\Form\ContactType;
use App\Repository\ContactRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

class HomeController extends AbstractController
{
    /**
     * @Route("/home", name="home")
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param ContactRepository $contactRepository
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function home(Request $request,
                         EntityManagerInterface $entityManager,
                         ContactRepository $contactRepository)
    {
        $contact = new Contact();
        $contactForm = $this->createForm(ContactType::class, $contact);

        if ($contactForm->isSubmitted() && $contactForm->isValid()) {
            // je persiste et je flush
            $entityManager->persist($contact);
            $entityManager->flush();
        }
        return $this->render('front/index.html.twig',[
            'contactForm' => $contactForm->createView()]);
    }

}