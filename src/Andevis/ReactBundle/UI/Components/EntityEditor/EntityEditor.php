<?php
/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 14.02.2018
 * Time: 21:36
 */

namespace Andevis\ReactBundle\UI\Components\EntityEditor;

use Andevis\ReactBundle\UI\Components\View\View;
use Andevis\ReactBundle\UI\Exceptions\UserException;


abstract class EntityEditor extends View implements EntityEditorInterface
{
    /**
     * Get entity ID field name
     * @return string
     */
    function getEntityIdField(){
        return 'id';
    }

    /**
     * Load entity list
     * @throws \Exception
     */
    public function loadEntityList()
    {
        return $this->getNormalizedEntityManager()->findBy(
            $this->getEntityClass(),
            $this->getListFields(),
            []
        );
    }

    /**
     * Load entity by ID
     * @param null|string $entityId
     * @return mixed
     * @throws \Exception
     */
    public function loadEntity(?string $entityId){

        $em = $this->getNormalizedEntityManager();
        $entityClass = $this->getEntityClass();
        if($entityId){
            $entityData = $em->getById(
                $entityClass,
                $entityId,
                $this->getListFields(),
                $this->getEntityIdField()
            );
            if(!$entityData) return false;
        } else {
            $entity = new $entityClass();
            $entityData = $em->normalize($entity, $this->getListFields());
        }
        return $entityData;
    }

    /**
     * Save entity
     * @param string $entityId
     * @return mixed
     * @throws \Exception
     */
    public function saveEntity(string $entityId){
        throw new UserException('Method saveEntity not implemented');
    }

    /**
     * Delete event
     * @param string $entityId
     * @return mixed
     * @throws \Exception
     */
    public function deleteEntity(string $entityId){
        $em = $this->getNormalizedEntityManager();
        $em->deleteById($this->getEntityClass(), $entityId, $this->getEntityIdField());
        return true;
    }

    /**
     * Get data filter criteria
     * @param $filters
     * @return array
     */
    function getDataFilterCriteria(?array $filters){
        $criteria = [];
        if($filters){
            foreach ($filters as $filter){
                $criteria[$filter['id']] = $filter['value'];
            }
        }
        return $criteria;
    }

    /**
     * Get data order
     * @param array|null $sorted
     * @return array
     */
    private function getDataOrderBy(?array $sorted){
        $order = [];
        if($sorted){
            foreach ($sorted as $sort){
                $order[$sort['id']] = $sort['desc'] ? 'DESC' : 'ASC';
            }
        }
        return $order;
    }


}
