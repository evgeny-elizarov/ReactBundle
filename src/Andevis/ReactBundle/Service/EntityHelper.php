<?php
/**
 * Created by PhpStorm.
 * User: eeliz
 * Date: 06.02.2018
 * Time: 08:36
 */

namespace Andevis\ReactBundle\Service;


use DateTime;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\PropertyInfo\Extractor\ReflectionExtractor;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class EntityHelper implements ContainerAwareInterface
{
    /**
     * @var Container
     */
    private $container = null;
    private $serializer = null;

    const DATE_TIME_FORMAT = 'd.m.Y H:i:s';

    /**
     * @param Container $container
     * @throws \Exception
     */
    public function __construct(Container $container)
    {
        $this->setContainer($container);
        $this->serializer = $this->getSerializer(self::DATE_TIME_FORMAT);
    }

    /**
     * @param $dateFormat
     * @return Serializer
     */
    private function getSerializer($dateFormat){
        $encoders = array(new JsonEncoder());
        $objNormalizer = new ObjectNormalizer(null, null, null, new ReflectionExtractor());

        $objNormalizer->setCircularReferenceLimit(1);
        $objNormalizer->setCircularReferenceHandler(function($object) {
            return $object->getId();
        });

        $normalizers = array(
            new DateTimeNormalizer($dateFormat),
            $objNormalizer
        );
        $serializer = new Serializer($normalizers, $encoders);
        return $serializer;
    }

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * Get entity by Id
     * @param $entityClass
     * @param $id
     * @param array $fields
     * @return mixed
     */
    function getById($entityClass, $id, array $fields){
        $entity = $this->getEntityRepository($entityClass)->findOneBy(['id' => $id]);
        if($entity) {
            return $this->normalize($entity, $fields);
        }
    }

    /**
     * Find one by
     * @param $entityClass
     * @param array $fields
     * @param $filters
     * @return null|object
     * @internal param $filter
     */
    function findOneBy($entityClass, array $fields, $filters){
        $entity = $this->getEntityRepository($entityClass)->findOneBy($filters);
        if($entity) {
            return $this->normalize($entity, $fields);
        }
    }

    /**
     * Find all
     * @param $entityClass
     * @param array $fields
     * @return array
     */
    function findAll($entityClass, array $fields)
    {
        $rows = $this->getEntityRepository($entityClass)->findAll();
        $normalized = [];
        foreach ($rows as $row){
            $normalized[] = $this->normalize($row, $fields);
        }
        return $normalized;
    }

    /**
     * Find by
     * @param $entityClass
     * @param array $fields
     * @param array $criteria
     * @param array|null $orderBy
     * @param null $limit
     * @param null $offset
     * @return array
     */
    function findBy($entityClass, array $fields, array $criteria, array $orderBy = null, $limit = null, $offset = null){
        $rows = $this->getEntityRepository($entityClass)->findBy($criteria, $orderBy, $limit, $offset);
        $normalized = [];
        foreach ($rows as $row){
            $normalized[] = $this->normalize($row, $fields);
        }
        return $normalized;
    }

    /**
     * Total count
     * @param $entityClass
     * @param array|null $criteria
     * @param string $id
     * @return mixed
     */
    function totalCount($entityClass, $criteria = null, $id = 'id'){
        // TODO: add $criteria
        return $this->getEntityRepository($entityClass)->createQueryBuilder('e')->select('count(e.'. $id.')')->getQuery()->getSingleScalarResult();
    }

    /**
     * @return EntityRepository
     */
    function getEntityRepository($entityClass){
        $em = $this->container->get('doctrine.orm.entity_manager');
        return $em->getRepository($entityClass);
    }

    /**
     * Normalize entity
     * @param $entity
     * @param array $attributes
     * @return array|object
     * @internal param $attributes
     * @internal param $callbacks
     */
    public function normalize($entity, array $attributes)
    {
        $context = [];
        if(sizeof($attributes) > 0){
            $context['attributes'] = $attributes;
        }
        return $this->serializer->normalize($entity, null, $context);
    }

    /**
     * Denormalize entity
     * @param $entityClass
     * @param object $entityObject
     * @return array
     */
    public function denormalize($entityClass, $entityObject){
        return $this->serializer->denormalize($entityObject, $entityClass);
    }

    /**
     * Set entity attributes
     * @param $entity
     * @param $property
     * @param $value
     */
    function setAttributeValue(&$entity, string $property, $value){
        $setter = sprintf('set%s', ucwords($property));
        // Set only existed properties
        if(method_exists($entity, $setter)){
            $entity->$setter($value);
        }
    }

    /**
     * @param string $entityClass
     * @param array $entityData
     * @return null|object
     */
    function saveEntity(string $entityClass, array $entityData)
    {
        // Update entity
        $needFlush = false;
        $dbEntity = $this->updateEntity($entityClass, $entityData, $needFlush, true);
        if($needFlush){
            $em = $this->getEntityManager();
            $em->flush();
        }
        return $dbEntity;
    }

    /**
     * Update entity
     * @param $entityClass
     * @param $entityData
     * @param bool $needFlush
     * @param bool $recursively
     * @param int $level
     * @return null|object
     * @throws \Exception
     */
    private function updateEntity($entityClass, $entityData, &$needFlush = false, $recursively = false, $level = 0)
    {
        /** @var EntityManagerInterface $em */
        $em = $this->getEntityManager();
        $metaFactory = $em->getMetadataFactory();
        /** @var ClassMetadata $entityMeta */
        $entityMeta = $metaFactory->getMetadataFor($entityClass);

        /** @var EntityManagerInterface $em */
        $r = $this->getEntityRepository($entityClass);

        // Prepare entity $criteria, take primary keys values
        $criteria = [];
        $pkFilled = true;
        foreach ($entityMeta->identifier as $pkField){
            if(!isset($entityData[$pkField])){
                $pkFilled = false;
                break;
            }
            $criteria[$pkField] = $entityData[$pkField];
        }
        if(!$pkFilled){
            $dbEntity = new $entityClass();
        } else {
            $dbEntity = $r->findOneBy($criteria);
            if (is_null($dbEntity)) {
                new \ErrorException(sprintf('Entity `%s` is not found in database!', $entityClass));
            }
        }

        // Remove primary keys
        $entityDataWithoutPk = array_filter(
            $entityData,
            function ($key) use ($entityMeta) {
                return !in_array($key, $entityMeta->identifier);
            }, ARRAY_FILTER_USE_KEY
        );

        $isChanged = false;
        if ($level == 0 || $level > 0 && $recursively) {
            foreach ($entityDataWithoutPk as $fieldName => $value) {


                // Проверить связь это или поле по наличию targetField
                if (is_array($value)) {
                    if(!isset($entityMeta->associationMappings[$fieldName])) {
                        throw new \Exception(sprintf('Field %s is not related field.', $fieldName));
                    }
                    $targetEntityClassName = $entityMeta->associationMappings[$fieldName]['targetEntity'];
                    /** @var ClassMetadata $targetEntityMeta */
                    $targetEntityMeta = $metaFactory->getMetadataFor($targetEntityClassName);

                    // Relation ... to many
                    if(
                        in_array(
                        $entityMeta->associationMappings[$fieldName]['type'],
                        [
                            ClassMetadata::MANY_TO_MANY,
                            ClassMetadata::ONE_TO_MANY,
                            ClassMetadata::TO_MANY
                        ])
                    )
                    {
                        if(sizeof($targetEntityMeta->identifier) > 1){
                            throw new \Exception(sprintf('Cant work with multiple pk key in entity class `%s`', $targetEntityClassName));
                        }
                        $relatedObject = $this->loadEntitiesFromArray($value, $targetEntityClassName, $targetEntityMeta->identifier[0], false);
                    } else {
                        // Если это связь, то передать все значения об этой связи в эту функцию рекурсивно,
                        // с указанием targetEntity.
                        $relatedObject = $this->updateEntity($targetEntityClassName, $value, $needFlush, $recursively, $level + 1);
                    }
                    $dbEntity->{'set' . ucfirst($fieldName)}($relatedObject);

                } else {

                    // Проверяем наличие изменяемого поля в модели
                    if (!isset($entityMeta->fieldMappings[$fieldName])) {
                        throw new \Exception(sprintf('Field `%s` is not found in entity class `%s`.', $fieldName, $entityClass));
                    }

                    // Конвертируем данные для базы
                    switch ($entityMeta->fieldMappings[$fieldName]['type'])
                    {
                        case 'datetime':
                            if(!is_null($value)){
                                $value = DateTime::createFromFormat(self::DATE_TIME_FORMAT, $value);
                            }
                            break;
                    }

                    // Вызвать сеттер и установить новое значение объекту.
                    $dbEntity->{'set' . ucfirst($fieldName)}($value);
                }
                $isChanged = true;
            }
        }

        if ($isChanged) {
            $em->persist($dbEntity);
            $needFlush = true;
        }
        return $dbEntity;
    }


    /**
     * Загружает объекты по атрибутам указанным в items.
     *
     * NB! Не умеет работать с множеством ключей у связываемого объекта, либо их отсутствия при поиске по значению.
     *
     * @param array $entityArray - массив массивов атрибутов, например: [[pkFieldName => 1], [pkFieldName => 2], ...]
     * @param string $entityClassName - класс объекта переданного в items
     * @param string $pkFieldName - первичный ключ у объекта в классе targetEntityClassName
     * @param bool $fakeLoad - будет возвращен объектов в которых установлены только первичные ключи.
     *        Быстрее работает, т.к. не происходит фактического обращения к БД.
     * @return array - массив объектов класса указанного в targetEntityClassName
     */
    protected function loadEntitiesFromArray($entityArray, $entityClassName, $pkFieldName, $fakeLoad = false)
    {
        /** @var EntityManagerInterface $em */
        $em = $this->getEntityManager();
        // TODO нужно продумать систему безопасности, чтобы посторонний имеющий доступ к этой функции
        // TODO не мог изменять права.
        $pks = [];
        foreach ($entityArray as $item)
        {
            if (!isset($item[$pkFieldName])) {
                throw new \InvalidArgumentException(sprintf("Primary key field '%s' of related object is not set!", $pkFieldName));
            }
            $pks[] = intval($item[$pkFieldName]);
        }

        $relatedObjects = [];

        // FIXME не проверяется наличие объектов в базе. Если объекта нет, то никаких ошибок не будет.
        if ($fakeLoad) {
            foreach ($pks as $pk) {
                // FIXME если связываемого объекта нет, то на этапе сохранения выпадет ошибка.
                $relatedObjects[] = $em->getReference($entityClassName, $pk);
            }
        } else {
            $relatedObjects = $em->getRepository($entityClassName)->findBy(array($pkFieldName => $pks));
        }

        return $relatedObjects;
    }

//    /**
//     * Update and save
//     * @param $entity
//     * @param $attributesValues
//     * @param $dateAttributes
//     */
//    function updateAndSave($entity, array $attributesValues, ?array $dateAttributes){
//        // Map form values to entity
//        foreach ($attributesValues as $attr => $value)
//        {
//            if(in_array($attr, $dateAttributes)){
//                $value = new \DateTime($value);
//            }
//            $this->setAttributeValue($entity, $attr, $value);
//        }
//
//        $em = $this->container->get('doctrine.orm.entity_manager');
//        $em->persist($entity);
//        $em->flush();
//    }
    function getEntityManager(){
        return $this->container->get('doctrine.orm.entity_manager');
    }

    /**
     * Delete entity by id
     * @param $entityClass
     * @param $id
     */
    function deleteById($entityClass, $id){
        $em = $this->getEntityManager();
        /** @var EntityRepository $r */
        $r = $em->getRepository($entityClass);
        $entity = $r->findOneBy(['id' => $id]);
        $em->remove($entity);
        $em->flush();
    }

}