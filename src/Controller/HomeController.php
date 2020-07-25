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
     * @param \Swift_Mailer $mailer
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function home(Request $request,
                         EntityManagerInterface $entityManager,
                         ContactRepository $contactRepository,
                         \Swift_Mailer $mailer)
    {
        $contact = new Contact();
        $contactForm = $this->createForm(ContactType::class, $contact);
        $contactForm->handleRequest($request);


        if ($contactForm->isSubmitted() && $contactForm->isValid()) {
            // je persiste et je flush
            $entityManager->persist($contact);
            $entityManager->flush();
            $mail = $contactForm['mail']->getData();
            $message = $contactForm['message']->getData();
            $name = $contactForm['Name']->getData();
            $phone = $contactForm['telephone']->getData();

            // MAILER
            $mail = (new \Swift_Message('Votre demande de contact'))
                ->setFrom('vincent@vamweb.fr')
                ->setTo($mail)
                ->setSubject('Votre demande de contact')
                ->setBody($this->renderView('mail/frontMail.html.twig',
                    ['name' => $name,
                        'phone' => $phone,
                        'message' => $message
                    ]));

            $autoMail =( new \Swift_Message('Nouvelle demande de contact'))
                ->setFrom('bistrotgirondin@gmail.com')
                ->setTo('bistrotgirondin@gmail.com')
                ->setSubject('Nouvelle demande de contact')
                ->setBody($this->renderView('mail/adminMail.html.twig',
                    ['name' => $name,
                        'phone' => $phone,
                        'message' => $message
                    ]));

            $this->addFlash('success', 'Votre demande de contact à bien été envoyée !');
            $mailer->send($mail);
            $mailer->send($autoMail);
        }
        return $this->render('front/index.html.twig',[
            'contactForm' => $contactForm->createView()]);
    }

}