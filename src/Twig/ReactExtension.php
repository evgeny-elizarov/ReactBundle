<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 14.03.2018
 * Time: 0:23
 */

namespace Andevis\ReactBundle\Twig;


use Andevis\ReactBundle\UI\ComponentBase\ComponentSet;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\HttpFoundation\Request;
use Twig_SimpleFunction as SimpleFunction;



class ReactExtension extends \Twig_Extension
{
    const FUNCTION_NAME = 'generateInitStateScript';

    /**
     * @var Container
     */
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function getFunctions()
    {
        return array(
            new SimpleFunction(
                self::FUNCTION_NAME,
                array($this, 'generateInitStateScript'),
                array('is_safe' => array('html'))
            ),
        );
    }

    public function getName()
    {
        return 'andevis_react';
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function generateInitStateScript(){

        /** @var ComponentSet $componentSet */
        $componentSet = $this->container->get("andevis_react.component_set");

        /** @var Request $request */
        $request = $this->container->get('request_stack')->getCurrentRequest();

        $state = json_encode([
            'locale' => $request->getLocale(),
            'viewsClassMap' => $componentSet->getViewsClassMap(),
            'viewsUserHandlers' => $componentSet->getViewsUserHandlers(),
            'viewsInitialGlobalState' => $componentSet->getViewsInitialGlobalState(),
            'viewsInitialState' => $componentSet->getViewsInitialState(),
        ]);
        return "(function() { window.AndevisReactBundle = ".$state."; })();";
    }

}