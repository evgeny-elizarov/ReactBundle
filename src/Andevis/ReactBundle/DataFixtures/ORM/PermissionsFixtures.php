<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 16.04.2018
 * Time: 0:34
 */

namespace Andevis\ReactBundle\DataFixtures\ORM;


use Andevis\AuthBundle\Entity\Permission;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PermissionsFixtures extends Controller implements FixtureInterface, OrderedFixtureInterface
{
    function getOrder()
    {
        return 1;
    }

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @param ObjectManager $em
     * @throws \Exception
     */
    public function load(ObjectManager $em)
    {
        $permissions = [
            // group, permission
            [
                'System',
                'Show access technical information',
                'Debug',
                'Allow user to see system technical information when access forbidden to access UI component'
            ]
        ];
        foreach ($permissions as $item) {
            list($groupName, $permissionName, $context, $description) = $item;

            // Create if not exists
            $permission = new Permission();
            $permission->setGroup($groupName);
            $permission->setPermission($permissionName);
            $permission->setContext($context);
            $permission->setDescription($description);
            $permission->setInternal(true);
            $em->persist($permission);
        }

        $em->flush();
    }
}