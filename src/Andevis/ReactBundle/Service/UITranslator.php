<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 24.01.2018
 * Time: 11:37
 */

namespace Andevis\ReactBundle\Service;


use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Translation\Loader\JsonFileLoader;
use Symfony\Component\Translation\Translator;

class UITranslator implements ContainerAwareInterface
{

    /**
     * @var Translator
     */
    private $translator = null;

    /**
     * @var Container
     */
    private $container = null;


    private $loadedLocales = [];

    /**
     * @param Container $container
     * @param string $locale
     * @param $locales
     * @throws \Exception
     */
    public function __construct(Container $container, string $locale, $locales)
    {
        $this->setContainer($container);

        $this->translator = new Translator($locale);
        $this->translator->addLoader('json', new JsonFileLoader ());
    }

    /**
     * @param string $key
     * @param array $parameters
     * @param string $locale
     * @return string
     * @throws \Exception
     */
    public function trans(string $key, ?array $parameters = null, string $locale){
        if(!isset($this->loadedLocales[$locale])){
            $this->addLocaleTranslation($locale);
            $this->loadedLocales[$locale] = true;
        }
        if(is_null($parameters)) $parameters = [];
        return $this->translator->trans($key, $parameters, null, $locale);
    }

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * @param $locale
     * @throws \Exception
     */
    public function addLocaleTranslation($locale)
    {
        $file = $this->container->get('kernel')
            ->getRootDir().DIRECTORY_SEPARATOR.implode(DIRECTORY_SEPARATOR, ['Resources', 'assets', 'i18n', 'lang', $locale.".json"]);
        if(!file_exists($file)){
            throw new \Exception(sprintf('Translation file `%s` not exists!', $file));
        }
        $this->translator->addResource('json', $file, $locale);
    }
}