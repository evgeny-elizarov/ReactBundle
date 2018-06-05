<?php
/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 05.06.2018
 * Time: 08:10
 */

namespace Andevis\ReactBundle\DependencyInjection\Compiler;


use Andevis\ReactBundle\Compiler\WebpackCompiler;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;


class OverrideMabaWebpackCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $definition = $container->getDefinition('maba_webpack.webpack_compiler');
        $definition->setClass(WebpackCompiler::class);
    }
}