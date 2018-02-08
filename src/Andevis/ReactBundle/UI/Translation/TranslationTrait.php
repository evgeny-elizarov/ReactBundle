<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 24.01.2018
 * Time: 15:11
 */

namespace Andevis\ReactBundle\UI\Translation;


//use ReflectionClass;

trait TranslationTrait
{
//    protected $translationMessages;
//    protected $translationPrefixKey;
//    protected $translationMessageFile;


//    /**
//     * Load translation messages
//     * @param $messageFile
//     * @throws \Exception
//     */
//    function loadTranslationMessages($messageFile){
//        $this->translationMessages = [];
//
//        // Get class file dir
//        $reflector = new ReflectionClass(get_class($this));
//        $classDir = dirname($reflector->getFileName());
//
//        // Temporary change current working dir to current class dir
//        $oldCwd = getcwd();
//        chdir($classDir);
//        $this->translationMessageFile = realpath ($messageFile);
//        $messagesDir = dirname(realpath ($this->translationMessageFile));
//        chdir($oldCwd);
//
//        if(!file_exists($this->translationMessageFile))
//            throw new \Exception(sprintf('Translation messages file `%s` not exists!', $this->translationMessageFile));
//
//        // TODO: cache parse result for production
//        // Parse message file to get default values
//        preg_match_all('/^{|\n*?\s*?([\w]+)\s*?:\s*?[\'"](.*)[\'"]\s*?,?\n*?|}$/im',
//            file_get_contents($this->translationMessageFile), $matches);
//        $this->translationMessages = [];
//        foreach ($matches[1] as $i => $key){
//            $this->translationMessages[$key] = $matches[2][$i];
//        }
//
//        // Remove project root
//        $translationPrefixKey = str_replace($this->container->get('kernel')->getProjectDir(), '', $messagesDir);
//        // Remove prefix
//        $removePrefix = DIRECTORY_SEPARATOR."src".DIRECTORY_SEPARATOR;
//        if($removePrefix)
//            $translationPrefixKey = str_replace($removePrefix, '', $translationPrefixKey);
//
//        $translationPrefixKey = str_replace(DIRECTORY_SEPARATOR, ".", $translationPrefixKey);
//        $this->translationPrefixKey = $translationPrefixKey;
//    }

    /**
     * Translation message
     * @param $localKey
     * @param array $parameters
     * @param null $locale
     * @return string
     * @throws \Exception
     */
    function i18n($localKey = null, array $parameters = [], $locale = null, $messageFile = null)
    {
        if(!$messageFile) $messageFile = "./messages.js";

        // Get caller file dir
        $bt =  debug_backtrace();
        $callerDir = dirname($bt[0]['file']);

        // Temporary change current working dir to current class dir
        $oldCwd = getcwd();
        chdir($callerDir);
        $translationMessageFile = realpath ($messageFile);
        $messagesDir = dirname(realpath ($translationMessageFile));
        chdir($oldCwd);

        if(!file_exists($translationMessageFile))
            throw new \Exception(sprintf('Translation messages file `%s` not exists!', $translationMessageFile));

        // TODO: cache parse result for production
        // Parse message file to get default values
        preg_match_all('/^{|\n*?\s*?([\w]+)\s*?:\s*?[\'"](.*)[\'"]\s*?,?\n*?|}$/im',
            file_get_contents($translationMessageFile), $matches);
        $translationMessages = [];
        foreach ($matches[1] as $i => $key){
            $translationMessages[$key] = $matches[2][$i];
        }

        // Remove project root
        $translationPrefixKey = str_replace($this->container->get('kernel')->getProjectDir(), '', $messagesDir);
        // Remove prefix
        $removePrefix = DIRECTORY_SEPARATOR."src".DIRECTORY_SEPARATOR;
        if($removePrefix)
            $translationPrefixKey = str_replace($removePrefix, '', $translationPrefixKey);

        $translationPrefixKey = str_replace(DIRECTORY_SEPARATOR, ".", $translationPrefixKey);



        $request = $this->container->get('request_stack')->getCurrentRequest();
        $translator = $this->container->get('andevis_react.ui_translator');

        // Add quotes to parameters
        $parametersWithQuotes = [];
        foreach ($parameters as $k => $parameter){
            $parametersWithQuotes['{'.$k.'}'] = $parameter;
        }

        if(!isset($translationMessages[$localKey])){
            throw new \Exception(sprintf('Key `%s` not set in translation message file `%s`', $localKey, $translationMessageFile));
        }

        $fullKey = $translationPrefixKey.".".$localKey;

        $translation = $translator->trans($fullKey, $parameters, $locale ? $locale : $request->getLocale());
        if($translation == $fullKey)
        {
            $replaceKeys = array_keys($parametersWithQuotes);
            $replaceValues = array_values($parametersWithQuotes);
            $translation = str_replace($replaceKeys, $replaceValues, $translationMessages[$localKey]);
        }
        return $translation;
    }
}