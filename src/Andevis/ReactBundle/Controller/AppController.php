<?php

namespace Andevis\ReactBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class AppController extends Controller
{
    public function indexAction(Request $request)
    {
        return $this->render('@App/app.html.twig');
    }
}
