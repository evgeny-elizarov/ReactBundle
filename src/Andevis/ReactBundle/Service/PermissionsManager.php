<?php
/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 12.04.2018
 * Time: 15:40
 */

namespace Andevis\ReactBundle\Service;


use Andevis\AuthBundle\Entity\Permission;
use Andevis\ReactBundle\UI\ComponentBase\ComponentSet;
use Andevis\ReactBundle\UI\Components\View\View;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\Query;
use Symfony\Component\DependencyInjection\ContainerInterface;

class PermissionsManager
{
    /**
     * @var ObjectManager
     */
    private $em;

    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * Permissions constructor.
     * @param ContainerInterface $container
     * @param ObjectManager $em
     */
    function __construct(ContainerInterface $container, ObjectManager $em)
    {
        $this->container = $container;
        $this->em = $em;
    }

    function updateViewsPermissions(){
        /** @var ComponentSet $componentSet */
        $componentSet = $this->container->get("andevis_react.component_set");

        /* @var \Doctrine\ORM\EntityManager $em */
        $em = $this->em;

        $em->beginTransaction();
        try {
            $viewPermissions = [];
            foreach ($componentSet->getViewsClasses() as $viewsClass)
            {
                $viewPermissions[] = View::getComponentPermissionName($viewsClass);
            }

            // Load view permissions from db
            /** @var Query $query */
            $query = $this->em->createQueryBuilder()
                ->select('p')
                ->from('AndevisAuthBundle:Permission', 'p')
                ->where('p.group = :group')
                ->setParameter('group', 'UI')
                ->getQuery();

            $dbViewPermissions = [];
            /** @var Permission $p */
            foreach ($query->getResult() as $p) {
                $dbViewPermissions[$p->getPermission()] = $p;
            }

            // Save new permissions
            foreach ($viewPermissions as $permissionName)
            {
                if(isset($dbViewPermissions[$permissionName])) {
                    unset($dbViewPermissions[$permissionName]);
                    continue;
                }

                // Create if not exists
                $permission = new Permission();
                $permission->setGroup('UI');
                $permission->setPermission($permissionName);
                $permission->setInternal(true);
                $em->persist($permission);
            }

            // Delete unused permissions
            foreach ($dbViewPermissions as $permission)
            {
                $em->remove($permission);
            }
            $em->flush();
            $em->getConnection()->commit();

        } catch (\Exception $e) {
            $em->getConnection()->rollBack();
            throw $e;
        }

    }
}