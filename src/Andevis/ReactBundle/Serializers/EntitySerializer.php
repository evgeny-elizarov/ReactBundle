<?php

namespace Andevis\ReactBundle\Serializers;

use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\PropertyAccess\Exception\NoSuchIndexException;
use Symfony\Component\PropertyAccess\Exception\NoSuchPropertyException;

/**
 * Сериализатор Entity с настройкой правил
 * @author Aleksei Baranov
 */
class EntitySerializer
{
    protected $fieldList = array();
    protected $entityList;

    function __construct(array $entityList, ObjectManager $em)
    {
        $this->entityList = $entityList;
        foreach ($entityList as $entityKey => $entity) {
            $metadata = $em->getClassMetadata(get_class($entity));
            $fields = $metadata->getFieldNames();
            foreach ($fields as $key => $value) {
                $this->fieldList[$value] = array(
                    'type' => $metadata->getTypeOfField($value),
                    'serializer' => $this->getDefaultSerializer($metadata->getTypeOfField($value))
                );
            }
            $fields = $metadata->getAssociationNames();

            foreach ($fields as $key => $value) {
                $this->fieldList[$value] = array(
                    'type' => $metadata->getAssociationMapping($value)['targetEntity'],
                    'serializer' => $this->getDefaultSerializer($metadata->getAssociationMapping($value)['targetEntity']),
                );
            }

        }
    }

    /**
     * Правила сериализации по умолчанию
     * @param string $type
     * @return \Closure
     */
    protected function getDefaultSerializer(string $type){
        switch ($type){
            case 'date':
                $func = function ($value){return $value->format('Y-m-d');};
                break;
            case 'datetime':
                $func = function ($value){return $value->format('Y-m-d H:i:s');};
                break;
            case 'integer':
            case 'smallint':
            case 'bigint':
            case 'string':
            default:
                $func = function ($value){
                    if(is_scalar($value)) {
                        $value = strval($value);
                    }
                    else {
                        // Если у объекта есть метод getId() тогда вызываем его
                        if (!is_array($value) and method_exists($value, 'getId')) {
                            $value = $value->getId();
                        }
                    }
                    return $value;
                };
        }
        return $func;
    }

    /**
     * Устанавливает правило сериализации конкретного атрибута объекта
     * @param $property
     * @param $function
     * @throws NoSuchPropertyException
     */
    public function setFieldSerializerFunction($property, $function)
    {
        if(isset($this->fieldList[$property]))
            $this->fieldList[$property]['serializer'] = $function;
        else
            throw new NoSuchPropertyException('Property "' . $property . '" not found. Available properties: ' . implode(', ', array_keys($this->fieldList)) . '.');
    }

    /**
     * Сериализует переданный массив объектов по заданным правилам
     * @param array $fields
     * @param array $excludeFields
     * @param bool $as_json
     * @return array|string
     */
    public function serialize($as_json = true, array $fields = array(), array $excludeFields = array())
    {
        $result = array();
        foreach ($this->entityList as $entityKey => $entity){
            $resultChild = array();

            foreach ($this->fieldList as $key => $value){
                if(!in_array($key, $fields) and $fields or in_array($key, $excludeFields) and $excludeFields)
                    continue;
                $serializer = $value['serializer'];
                $methodName = 'get'.ucfirst($key);
                $methodResult = $entity->$methodName();
                if(is_null($methodResult)) {
                    $resultChild[$key] = null;
                } else {
                    $resultChild[$key] = $serializer($entity->$methodName());
                }
            }
            array_push($result, $resultChild);
        }

        if($as_json)
            $result = json_encode($result);
        return $result;
    }
}