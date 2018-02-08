<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 12.12.2017
 * Time: 13:58
 */

namespace Andevis\ReactBundle\EventSubscriber;

use Andevis\ReactBundle\UI\ComponentBase\ComponentSet;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class BuildSubscriber implements EventSubscriberInterface
{
    use ContainerAwareTrait;

    function __construct($container)
    {
        $this->setContainer($container);
    }

    public function onKernelController(){
        $env =  $this->container->get( 'kernel' )->getEnvironment();

        /**
         * Rebuild config in dev mode
         */
        if ($env == 'dev') {
            /** @var ComponentSet $componentSet */
            $componentSet = $this->container->get("andevis_react.component_set");
            $componentSet->onKernelController();
        }
        return;
    }

    public function onKernelRequest(GetResponseEvent $event)
    {

    }

    public static function getSubscribedEvents()
    {
        return array(
            // must be registered after the default Locale listener
            KernelEvents::REQUEST => array(array('onKernelRequest', 15)),
            KernelEvents::CONTROLLER => array(array('onKernelController', 15)),
        );
    }
}