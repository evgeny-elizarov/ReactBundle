<?php
/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 08.02.2018
 * Time: 08:41
 */

namespace Andevis\ReactBundle\UI\Components\View;


use Symfony\Component\DependencyInjection\ContainerInterface;

interface ViewInterface
{
    /**
     * Get view initial statee
     * @param string $viewId
     * @param ContainerInterface $container
     * @return mixed
     */
    static public function getInitialState(string $viewId, ContainerInterface $container);
}