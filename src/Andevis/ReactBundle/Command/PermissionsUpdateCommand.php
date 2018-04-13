<?php
/**
 * Created by PhpStorm.
 * User: Aleksei Baranov
 * Date: 8.06.17
 * Time: 17:51
 */

namespace Andevis\ReactBundle\Command;

use Andevis\ReactBundle\Service\PermissionsManager;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;



class PermissionsUpdateCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('react:permissions:update')
            ->setDescription('Updates all registered Views components access permissions. Remove unused permissions.');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return null
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->write('Update Views permissions... ');
        $pm = new PermissionsManager(
            $this->getContainer(),
            $this->getContainer()->get('doctrine')->getManager()
        );
        $pm->updateViewsPermissions();
        $output->write('complete');
        return;
    }


}