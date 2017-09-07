<?php
/**
 * Created by PhpStorm.
 * User: Aleksei Baranov
 * Date: 8.06.17
 * Time: 17:51
 */

namespace Andevis\ReactBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpKernel\Kernel;


class UpdateTranslationsCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('andevis:react:translations:update')
            ->setDescription('Update translation file.');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return null
     * @throws \Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        // передать параметр locale
        $projectRoot = dirname($this->getContainer()->get('kernel')->getRootDir());
        $reactAppRoot = join(DIRECTORY_SEPARATOR, [$projectRoot, 'client', 'app']);

        $localePathname = join(DIRECTORY_SEPARATOR, [$reactAppRoot, 'translations', 'et.js']);

        $finder = new Finder();
        $finder->in($reactAppRoot);
        $finder->depth('>= 0');
        $finder->files()->name('*.js');

        $io = new SymfonyStyle($input, $output);
        $io->writeln('Scanning files in ' . $reactAppRoot . '...');

        $allCodes = [];
        foreach ($finder as $file) {
            $pathname = $this->toUtf($file->getPathname());

            $io->writeln($pathname);

            $codes = $this->getTranslatableCodes($pathname, false);
            if (count($codes) > 0) {
                $allCodes = array_merge($allCodes, $codes);
            }

        }
        $allCodes = array_unique($allCodes);

        $newTranslations = [];
        foreach ($allCodes as $code) {
            $newTranslations[$code] = "";
        }
        if (file_exists($localePathname)) {
            $signature = '/\s*^\s*export default/';
            $existTranslations = file_get_contents($localePathname);
            $existTranslations = preg_replace($signature, '', $existTranslations);
            $existTranslations = json_decode($existTranslations, true);

            if ($existTranslations == null) {
                throw new \Exception('Invalid format of locale file : ' . $localePathname);
            }

            // Нужно из старого массива удалить все ключи, которых нет в новом
            $existTranslations = array_filter($existTranslations, function ($item) use ($newTranslations) {
                return isset($newTranslations[$item]);
            }, ARRAY_FILTER_USE_KEY);

            // Далее нужно объединить массивы, но так, чтобы новый добавлял, но не перезаписывал старый.
            $newTranslations = $existTranslations + $newTranslations;
        }

        ksort($newTranslations);
        $data = json_encode($newTranslations, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $data = 'export default ' . $data;
        file_put_contents($localePathname, $data);
        return;
    }

    /**
     * Обеспечивает корректную работу с русскими символами в названиях файлов и папок, в Windows.
     * @param $str
     * @return string
     */
    private function toUtf($str)
    {

        return strcmp(PHP_OS, 'WINNT') == 0 ? iconv('cp1251', 'utf-8', $str) : $str;
    }

    /**
     * @param $pathname
     * @param bool $unique
     * @return array
     */
    protected function getTranslatableCodes($pathname, $unique = false)
    {
        $translatableSignature = '/@translatable\([\'"](.*?)[\'"]\)|\.i18n\([\'](.*?)[\'].*?/';
        preg_match_all($translatableSignature, file_get_contents($pathname), $keys, PREG_PATTERN_ORDER);
        $result = [];
        $prefix = '';
        for ($i = 0; $i < count($keys[0]); $i++) {
            if (strlen($keys[1][$i]) > 0) {
                $prefix = $keys[1][$i];
                // Удаляет пробелы и кавычки в начале и конце префикса
                $prefix = trim(trim($prefix), '\'"');
                // Прибавляем точку к префиксу
                $prefix .= '.';
            } else {
                $key = $keys[2][$i];
                $key = trim(trim($key), '\'"');
                $key = $prefix . $key;

                $result[] = $key;
            }
        }
        if (count($result) > 0 && $unique) {
            $result = array_unique($result);
        }
        return $result;
    }
}