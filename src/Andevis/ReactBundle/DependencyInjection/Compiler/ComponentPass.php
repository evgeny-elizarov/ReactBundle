<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 05.12.2017
 * Time: 10:09
 */

namespace Andevis\ReactBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;


class ComponentPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        // always first check if the primary service is defined
        if (!$container->has('andevis_react.component_set')) {
            return;
        }

        $componentSet = $container->findDefinition('andevis_react.component_set');

        // find all service IDs with the app.mail_transport tag
        $taggedComponents = $container->findTaggedServiceIds('react.components');

        foreach ($taggedComponents as $id => $tags) {
            // add the component service to the ComponentSet service
            // new Reference($id)
            $componentSet->addMethodCall('addComponentClass', array($id));
        }
    }
}