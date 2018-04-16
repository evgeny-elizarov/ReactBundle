<?php
namespace Andevis\ReactBundle\Security;

use Andevis\AuthBundle\Entity\User;
use Andevis\AuthBundle\Service\PermissionChecker;

use Andevis\ReactBundle\UI\ComponentBase\Component;
use Andevis\ReactBundle\UI\Components\View\View;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 12.04.2018
 * Time: 16:07
 */

class UIVoter extends Voter
{
    /* @var PermissionChecker */
    protected $permissionChecker;

    /* @var ContainerInterface  */
    protected $container;

    public function __construct(PermissionChecker $permissionChecker, ContainerInterface $container)
    {
        $this->permissionChecker = $permissionChecker;
        $this->container = $container;
    }

    /**
     * @inheritdoc
     */
    protected function supports($attribute, $subject)
    {
        return
            substr($attribute, 0, 3) === 'UI:' &&
            class_exists($subject) &&
            is_subclass_of($subject, Component::class);
    }

    /**
     * @param string $attribute
     * @param mixed $subject
     * @param TokenInterface $token
     * @return array|bool|mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    protected function voteOnAttribute($attribute, $subject, TokenInterface $token)
    {
        list($group, $permissionName) = explode(":", $attribute, 2);

        // Check if user got permission
        /** @var PermissionChecker $permissionChecker */
        $permissionChecker = $this->container->get('auth.permission_checker');
        $isGranted = $permissionChecker->isGranted(
            $token->getUser(),
            $token->getRoles(),
            $group,
            $permissionName,
            $subject);
        return $isGranted;

    }
}