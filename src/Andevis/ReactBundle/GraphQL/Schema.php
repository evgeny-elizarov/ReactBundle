<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 05.12.2017
 * Time: 13:43
 */

namespace Andevis\ReactBundle\GraphQL;

use Andevis\GraphQLBundle\GraphQL\AbstractBundleSchema;
use Andevis\ReactBundle\GraphQL\Type\ViewUserHandlers;
use Andevis\ReactBundle\UI\ComponentBase\Component;
use Andevis\ReactBundle\UI\ComponentBase\ComponentSet;
use Andevis\ReactBundle\UI\ComponentBase\ExecutionContext;
use Youshido\GraphQL\Config\Schema\SchemaConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\Scalar\IdType;

class Schema extends AbstractBundleSchema
{
    /**
     * Build react components schema
     * @param SchemaConfig $config
     * @throws \Exception
     */
    function build(SchemaConfig $config)
    {
        /** @var ComponentSet $componentSet */
        $componentSet = $this->container->get("andevis_react.component_set");
        $container = $this->container;

        /** @var Component $component */
        foreach ($componentSet->getBundleComponentClasses() as $componentClass)
        {

            $resolveConfigList = call_user_func(array($componentClass, 'resolveConfig'));
            if($resolveConfigList){

                foreach ($resolveConfigList as $resolveConfig){

                    /** @var AbstractResolveConfig $resolveConfig */
                    // Prepare field name
                    $fieldName = call_user_func(array($componentClass, 'getSchemaName'), $componentClass). "_" . $resolveConfig->getSchemaName();

                    $methodsArguments = $resolveConfig->getArguments();
                    if(isset($methodsArguments['id'])){
                        throw new \Exception('`id` this name is a reserved argument word, and can not be used!');
                    }

                    // Add component ID
                    $fieldArguments = ['id' => new IdType()];

                    if(is_array($methodsArguments)){
                        // Use merge to set ID attribute first
                        $fieldArguments = array_merge($fieldArguments, $methodsArguments);
                    }

                    // Prepare field info
                    $fieldInfo = [
                        'type' => $resolveConfig->getType(),
                        'args' => $fieldArguments,
                        'resolve' => function ($context, $args, ResolveInfo $info) use ($container, $componentClass, $resolveConfig) {

                            /** @var ComponentSet $componentSet */
                            $componentSet = $this->container->get("andevis_react.component_set");

                            // Create execution context
                            $executionContext = new ExecutionContext($componentSet, $container);
                            return $executionContext->executeComponentResolver($componentClass, $args['id'], $resolveConfig, $args);
                        }
                    ];

                    if($resolveConfig instanceof QueryResolveConfig)
                    {
                        $config->getQuery()->addField($fieldName, $fieldInfo);
                    } elseif ($resolveConfig instanceof MutationResolveConfig ) {
                        $config->getMutation()->addField($fieldName, $fieldInfo);
                    } else {
                        throw new \Exception(sprintf('Undefined type of %s resolve config ', get_class($resolveConfig)));
                    }
                }
            }
        }

        // Get views user handlers
        $config->getQuery()->addField('viewsUserHandlers', [
            'type' => new ListType(new ViewUserHandlers()),
            'resolve' => function ($context, $args, ResolveInfo $info) use ($container ) {
                /** @var ComponentSet $componentSet */
                $componentSet = $this->container->get("andevis_react.component_set");
                $response = array();
                foreach ($componentSet->getViewsUserHandlers() as $viewId => $userHandlers){
                    $response[] = [
                        'viewId' => $viewId,
                        'userHandlers' => $userHandlers
                    ];
                }
                return $response;
            }
        ]);

        // $config->getQuery()->addField($fieldName, $fieldInfo);
    }
}