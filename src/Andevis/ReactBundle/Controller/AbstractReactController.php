<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 24.04.2017
 * Time: 16:51
 */

namespace  Andevis\ReactBundle\Controller;

use Andevis\AuthBundle\Entity\User;
use Andevis\GraphQLBundle\Factory\GraphQLFactory;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

abstract class AbstractReactController extends Controller{

    /**
     * @param string $entityClassName
     * @return object
     */
    public function getEntityResolver(string $entityClassName)
    {
        /** @var GraphQLFactory $gqlFactory */
        $gqlFactory = $this->container->get("graphql_factory");
        return $gqlFactory->getEntityResolver($entityClassName);
    }

    /**
     * Get all routes
     */
    public function getAllRoutes(){
        $router = $this->container->get('router');
        $collection = $router->getRouteCollection();
        $allRoutes = $collection->all();
        $routes = array();

        /** @var $params \Symfony\Component\Routing\Route */
        foreach ($allRoutes as $route => $params)
        {
            $routes[$route] = array(
                'path' => $params->getPath(),
                'requirements' => $params->getRequirements()
            );
        }
        return $routes;
    }

    /**
     * @param Request $request
     * @param string $component
     * @param array $props
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function renderComponent(Request $request, string $component, $props = array())
    {
        $locale = $request->getLocale();
        $serializer = $this->get('serializer');
        $tokenStorage = $this->container->get('security.token_storage');

        $user = $tokenStorage->getToken()->getUser();
        if($user == 'anon.'){
            $userObj = null;
        } else {
            $userObj = array(
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'personalCode' => $user->getPersonalCode(),
                'email' => $user->getEmail(),
                'isActive' => $user->isActive(),
            );
        }

        $userPermissions = array();
        if($user instanceof User)
        {
            foreach ($user->getRoles() as $role ){
                foreach($role->getPermissions() as $permission)
                {
                    $entityClassParts = explode("\\", $permission->getEntityClass());
                    $className = end($entityClassParts);
                    if(!isset($userPermissions[$className]))
                        $userPermissions[$className] = array();
                    $userPermissions[$className][$permission->getCode()] = 1;
                }
            }
        }

        $session_cookie_lifetime = $this->container->getParameter('session.storage.options')['cookie_lifetime'];
        $defaultProps = array(
            'sessionCookieLifetime' => $session_cookie_lifetime,
            'user' => $userObj,
            'userPermissions' => $userPermissions,
            'requestUri' => $request->getRequestUri(),
            'baseUrl' => $request->getBaseUrl(),
            'routes' => $this->getAllRoutes(),
            'locale' => $locale
        );
        $props = array_merge($defaultProps, $props);
        return $this->render('react_component.html.twig', [
            'component' => $component,
            // We pass an array as props
            'props' => $serializer->normalize($props)
        ]);
    }
}
