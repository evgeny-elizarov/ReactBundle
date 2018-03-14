<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 14.03.2018
 * Time: 0:23
 */

namespace Andevis\ReactBundle\Twig;


use Symfony\Component\DependencyInjection\Container;
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

    public function generateInitStateScript(){
        $componentSet = $this->container->get("andevis_react.component_set");
        $state = json_encode([
            'viewsUserHandlers' => $componentSet->getViewsUserHandlers(),
            'viewsInitialState' => $componentSet->getViewsInitialState(),
        ]);
        return "(function() { window.AndevisReactBundle = ".$state."; })();";
    }

}