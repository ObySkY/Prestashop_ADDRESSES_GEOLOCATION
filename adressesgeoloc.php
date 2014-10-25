<?php
/*
* 2014 ObYsKY
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
* @author ObYsKy <contact.obysky@gmail.com>
* @copyright  2013-2014 Obysky
* @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*/

if (!defined('_PS_VERSION_'))
	exit;

class Adressesgeoloc extends Module
{
	public function __construct()
	{
		$this->name = 'Adressesgeoloc';
		$this->tab = 'administration';
		$this->version = '1.1';
		$this->author = 'ObYsKy';
		$this->module_key = '87e42af055aa1f74f72f04e8011d4582';
		parent::__construct();
		$this->displayName = $this->l('Adresses Géolocalisés');
		$this->description = $this->l('Géolocalisez vos clients et donnez leurs la possibilité de remplir automatiquement leur champ adresses.');
		$this->confirmUninstall = $this->l('Are you sure for removing All Informations of module ???');
	}
	public function install()
	{
		if (Db::getInstance()->getValue('SELECT id_module FROM '._DB_PREFIX_.'module WHERE name =\''.pSQL($this->name).'\''))
			return true;
		if (!parent::install())
			return false;
		
		return true;
	}
	public function uninstall()
	{
		if (!parent::uninstall())
			return false;
		
		return true;
	}
	public function getContent()
	{
		$output = '<h2>'.$this->displayName.'</h2>';
		if (Tools::isSubmit('submitOptions'))
		{
			$racine = $_SERVER['DOCUMENT_ROOT'].'';
			$chemin_module = $racine.'/modules/adressesgeoloc/fichiers_a_copier/';
			$chemin_theme = $racine.'/themes/'.Tools::getValue('select_theme').'/';
			$files = array('address.tpl', 'js/geo.js','js/jquery.ui.addresspicker.js','js/jquery-1.4.4.min.js','js/jquery-ui-1.8.7.min.js');
			$return = true;
			foreach ($files as $value)
				$return &= @copy($chemin_module.$value, $chemin_theme.$value);
			
			if ($return) {
				$output .= '<div class="conf confirm">'.$this->l('Fichiers Copiés').'</div>';
			} else {
				$content_redme = file_get_contents("readme_fr.html", true);
				$output .= $content_redme.'<br><br><br>';
				$output .= '<div class="conf error">'.$this->l('ERROR: Fichiers non copiés, Effectuer la copie manuellement').'</div>';
			}
		}
		return $output.$this->displayForm();
	}
	public function displayForm()
	{
		$select_theme = '';
		$theme_available = Theme::getAvailable();
		$select_theme .= '<select id="select_theme" name="select_theme" > ';
	   	foreach ($theme_available as $value)
	   		$select_theme.= '<option value="'.$value.'"> '.$value.' </option>';
	   	
    	$select_theme .= '</select> ';
		$return = '
		<form action="'.Tools::safeOutput($_SERVER['REQUEST_URI']).'" method="post">
			<fieldset>
				<legend><img src="'.$this->_path.'logo.png" alt="" title="" />'.$this->l('Settings').'</legend>
				'.$this->l('Si votre prestashop nest pas directement à la racine de votre serveur, vous devez copier les fichiers du dossier "fichiers_a_copier" dans votre emplacement theme/votre theme manuellement').'
				<br><br>
				<label>'.$this->l('Copier automatiquement les fichier dans votre theme : ').'</label>
				<div class="margin-form">
					'.$select_theme.'
				<input type="submit" name="submitOptions" value="'.$this->l('Copier').'" class="button" />
				</div>
				
				'.$this->l('Il est possible que vous deviez supprimer le cache smarty et les cokies javascripts pour visualiser les changements.').'
			</fieldset>
		</form>';
		return $return;
	}
	

}
