<?php
namespace Andevis\ReactBundle\Security;

use Andevis\AuthBundle\Entity\User;
use Andevis\AuthBundle\Service\PermissionChecker;

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

class ViewAccessVoter extends Voter
{
    const HAS_VIEW_ACCESS = 'HAS_VIEW_ACCESS';

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
        return $attribute == self::HAS_VIEW_ACCESS && class_exists($subject);
    }

    protected function voteOnAttribute($attribute, $subject, TokenInterface $token)
    {
        // Check class
        if(!is_subclass_of($subject, View::class))
            return false;

        // Check if user got permission
        /** @var PermissionChecker $permissionChecker */
        $permissionChecker = $this->container->get('auth.permission_checker');
        $isGranted = $permissionChecker->isGranted($token->getUser(), $token->getRoles(), 'UI', View::getComponentPermissionName($subject));
        return $isGranted;

    }
}