<?php

namespace Andevis\ReactBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class AppController extends Controller
{
    public function indexAction(Request $request)
    {
        $componentSet = $this->container->get("andevis_react.component_set");

        return $this->render('@App/app.html.twig', [
            'viewsUserHandlers' => $componentSet->getViewsUserHandlers(),
            'viewsInitialState' => $componentSet->getViewsInitialState(),
        ]);
    }
}
