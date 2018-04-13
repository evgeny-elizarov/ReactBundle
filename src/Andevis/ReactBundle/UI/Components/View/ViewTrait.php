<?php
/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 12.04.2018
 * Time: 16:30
 */

namespace Andevis\ReactBundle\UI\Components\View;


/**
 * Common features needed in View.
 */
trait ViewTrait
{
    /**
     * Returns true if the service id is defined.
     *
     * @param string $id The service id
     *
     * @return bool true if the service id is defined, false otherwise
     *
     * @final since version 3.4
     */
    protected function has($id)
    {
        return $this->container->has($id);
    }

    /**
     * Checks if the attributes are granted against the current authentication token and optionally supplied subject.
     *
     * @param mixed $attributes The attributes
     * @param mixed $subject    The subject
     *
     * @return bool
     *
     * @throws \LogicException
     *
     * @final since version 3.4
     */
    protected function isGranted($attributes, $subject = null)
    {
        if (!$this->container->has('security.authorization_checker')) {
            throw new \LogicException('The SecurityBundle is not registered in your application. Try running "composer require symfony/security-bundle".');
        }

        return $this->container->get('security.authorization_checker')->isGranted($attributes, $subject);
    }

}