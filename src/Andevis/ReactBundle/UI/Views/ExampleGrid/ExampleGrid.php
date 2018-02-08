<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 18.12.2017
 * Time: 4:10
 */

namespace Andevis\ReactBundle\UI\Views\ExampleGrid;


use Andevis\AuthBundle\Entity\Permission;
use Andevis\AuthBundle\Entity\User;
use Andevis\ReactBundle\UI\Components\Grid\Grid;
use Andevis\ReactBundle\UI\Components\View\View;
use Doctrine\ORM\EntityRepository;

class ExampleGrid extends View
{

    /**
     * Load users
     * @param Grid $grid
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @internal param JqxDataAdapter $data
     */
    function gridExample_onLoadData(Grid $grid)
    {

        /** @var EntityRepository $users */
        $em = $this->getEntityManager()->getRepository(Permission::class);

        // Sort options
        $order = [];
        if($grid->getSortOrder() && $grid->getSortDataField()){
            $order[$grid->getSortDataField()] = $grid->getSortOrder();
        }
        $permissions = $em->findBy([], $order, $grid->getLimit(), $grid->getOffset());

        $total = $em->createQueryBuilder('u')->select('count(u.id)')->getQuery()->getSingleScalarResult();

        $records = [];
        /** @var Permission $permission */
        foreach ($permissions as $permission){
            $records[] = [
                'id' => $permission->getId(),
                'permission' => $permission->getPermission()
            ];
        }

        $grid->setRecords($records, $total);
    }
}