<?php
/**
 * Created by PhpStorm.
 * User: EvgenijE
 * Date: 24.01.2018
 * Time: 14:25
 */

namespace Andevis\ReactBundle\UI\Exceptions;


use Throwable;

class ValidationError extends RuntimeException
{
    private $subErrors;

    function __construct($message = null, int $code = 0, Throwable $previous = null)
    {
        if(is_array($message))
        {
            $messagesText = [];
            foreach ($message as $m){
                if($m instanceof \Exception){
                    $messagesText[] = $m->getMessage();
                    $this->subErrors[] = $m;
                } else {
                    throw new \Exception('Validation exception message variable must be a string or ValidationError type');
                }
            }
            $message = implode(",", $messagesText);
        }
        else {
            $message = (string) $message;
        }
        parent::__construct($message, $code, $previous);
    }


}