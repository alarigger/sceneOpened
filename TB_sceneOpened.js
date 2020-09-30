
/*

Martin Cuinet 

Version du 26_08_2020 modif : Alexandre Cormier 

changement du chemin vers le TPL 
inclu le script Export2k_v2
rangement dans une seule fonction sceneOpened


*/



function TB_sceneOpened()
{
	
	MessageLog.trace("Processing TB_sceneOpened.js")
	
	
	//VARIALES
	
	var isTemplateAlreadyHere = false;
	var type =[ "READ"];
	var DisplayNodesList = node.getNodes(type);	
	var currentJob = scene.currentJob()	
	
	var TEMPLATE_PATH_ANIM = "/USA_DB/environments/ANA_FILOUTE/library/PREPA/BASE_PLAN.tpl"
	var TEMPLATE_PATH_DESIGN  = "/USA_DB/environments/ANA_FILOUTE/library/DESIGN/BASE_DESIGN.tpl"
	var TEMPLATE_PATH_RIG = "/USA_DB/environments/ANA_FILOUTE/library/RIG/BASE_RIG.tpl"

	
	// EXECUTE

	for (var i = 0; i<DisplayNodesList.length; i++){

		if (DisplayNodesList[i] == "Top/PLANS"){

			isTemplateAlreadyHere = true;

		}

	}

	if (!isTemplateAlreadyHere){

		MessageLog.trace("Le template n'est pas là... on l'importe");

		//to do supprimer le composite plus display et write node 
		//check nodes to move after
		//FG ref + Top Layer
		// les plqcer dqns le bqckdrop
		//a relier au composite_2
		// camera peg + camera a bouger vers le PLANS
		//relier le camera peg au PLANS
		
		Build_Scene();
			

		
	}else{

		MessageLog.trace("Le template est déjà là !");

	}


	MessageLog.trace("Closing TB_sceneOpened.js")
	
	
	
	
	//FUNCTIONS
	
	function Build_Scene(){
	
		DeleteUselessElements();
		
		switch (currentJob){
		
			case 'DESIGN' :
			
				Import_Template(TEMPLATE_PATH_DESIGN);
				
			break;
			case 'RIG' :
			
				Import_Template( TEMPLATE_PATH_RIG);
				
			break;
			default:
			
				Import_Template(TEMPLATE_PATH_ANIM);
				
				ANA_Export2K_V2();	
				
		
		}
		
		view.refreshViews();				

	
	}
		
	function Import_Template(path){

		
		var myCopyOptions = copyPaste.getCurrentCreateOptions();
		var myPasteOptions = copyPaste.getCurrentPasteOptions();
		myPasteOptions.extendScene = false;


		myCopyOptions.addModelsDir = false;
		var myDragObject = copyPaste.copyFromTemplate(path,0,0,myCopyOptions);

		copyPaste.pasteNewNodes(myDragObject,"",myPasteOptions);

		
		selection.clearSelection();
		
		view.refreshViews();

	}

	function DeleteUselessElements(){

		var writeToDelete = "Top/Write";
		var displayToDelete = "Top/Display";
		var compositeToDelete = "Top/Composite";
		
		node.deleteNode(writeToDelete);
		node.deleteNode(displayToDelete);
		node.deleteNode(compositeToDelete);

	}




}







//EXPORT FINAL 2K V2


/*
Martin cuinet 

modif Alexandre Cormier version du 26 08 2020 :

	mise a jour des noms des attribus du writer et de l'ordre des arguments de la fonction node.setTextAttr
	activation de Output movie dans le writer. 
	organisation en deux fonctions (generateEpisodePath() et export)

*/

/*
 * La fonction active le write node 2k et désactive les autres
 * Changement de la résolution de la scene
 * Changement/set du codec et path ds les write node
 *
 */
 

function ANA_Export2K_V2(){


		var rendu_FINAL_2K = "";
		var targetNode = "Top/Write";
	 
		// Finding episode Name & Number
		var leNomDeLaScene;
		var dossierEpisodique = "ANAFILOUTE_S1";
		var leNomDeEpisode;
		var count = 0;
		var chemin;
		var format;
		
		leNomDeLaScene = scene.currentScene();

		var nomSceneDecoup = leNomDeLaScene.split("_");
		var numEpisode = nomSceneDecoup[0];
		var numShot = nomSceneDecoup[1];
		
		var listEPS2= 
		["101_CACHETTE_CADEAUX",
		"102_EPOUVANTAIL",
		"103_LES_TOURNESOLS",
		"104_PAS_DE_TELE_ANA",
		"105_RANGE_TA_CHAMBRE",
		"106_LES_BISOUS_PIQUENT",
		"107_ABOMINABLE_PIQURE",
		"108_ESPION_PERE_NOEL",
		"109_SAC_A_PUCES",
		"110_REVE_MERVEILLEUX",
		"111_LETTRE_POUR_ANA",
		"112_LA_PHOTO",
		"113_MON_HISTOIRE",
		"114_LA_DENT_DE_LAIT",
		"115_ABRACADABRA",
		"116_DROMABOSSE",
		"117_TETE_DE_LA_GIRAFE",
		"118_TONTON_PUCES",
		"119_BIENTOT_VACANCES",
		"120_JOURNEE_SANS_ANA",
		"121_LE_CRABE",
		"122_TROP_LONG_ATTENDRE",
		"123_BIMBAMBOUM",
		"124_PETITES_ROUES",
		"125_BROCOLI",
		"126_LE_VOYAGE",
		"127_UN_CHIEN_BERNARD",
		"128_CADEAUX_PUCES",
		"129_HOP_HOP_HOP",
		"130_TRUFFES_FRAICHES",
		"131_PORTRAIT_DE_FAMILLE",
		"132_GRAND_FRERE",
		"133_ETOILES_PLEIN_YEUX",
		"134_IGLOO_DOUDOU",
		"135_CHATEAU_DE_SABLE",
		"136_PENSION_COMPLETE",
		"137_LA_DANSE_DE_LEAU",
		"138_DROLE_PIQUE_NIQUE",
		"139_ECOLE_EST_FINIE",
		"140_PLUS_BEAU_CHIEN",
		"141_SUIVEZ_LES_TRACES",
		"142_LES_LUCIOLES",
		"143_LOULETTE_BLANCHE",
		"144_SLALOM",
		"145_DANS_LA_FORET",
		"146_CONFITURE_SPECIALE",
		"147_BIENVENUE_PERE_NOEL",
		"148_LE_PETIT_THEATRE",
		"149_QUI_EST_QUI",
		"150_LE_CERF_VOLANT",
		"151_ACROBATIES",
		"152_CHANSONS_SOUS_LUNE",
		] 
		
		
	// EXECUTE 
	
	
		scene.beginUndoRedoAccum("Export_Final_2K");
		
		Export_Final_2K_v2();
		
		scene.beginUndoRedoAccum("Export_Final_2K");

	// FUNCTIONS 
	 
	function generateEpisodePath(){
		
		for (var i =0; i<listEPS2.length; i++){
			if (numEpisode == listEPS2[i].split("_")[0]){
				
				leNomDeEpisode = listEPS2[i];
				break;
			}
		}
			
		var EpisodePath =  "\\\\srvrendus\\"+dossierEpisodique+"\\02_EPISODES\\"+ leNomDeEpisode +"/" + leNomDeLaScene;
		MessageLog.trace(EpisodePath);
		
		return EpisodePath;
		
	}
	 

	function Export_Final_2K_v2() {
		
		rendu_FINAL_2K =generateEpisodePath();

			node.setTextAttr(targetNode, "EXPORT_TO_MOVIE",1,"Output Movie")
			node.setTextAttr(targetNode, "MOVIE_PATH",1,rendu_FINAL_2K);
			node.setTextAttr(targetNode, "MOVIE_VIDEOAUDIO",1,"Enable Sound(true)Enable Video(true)QT(000000000000000000000000000003E27365616E000000010000000600000000000001D376696465000000010000001000000000000000227370746C0000000100000000000000004156646E00000000002000000200000000207470726C000000010000000000000000000000000000000000000000000000246472617400000001000000000000000000000000000000000000000000000000000000156D70736F00000001000000000000000000000000186D66726100000001000000000000000000000000000000187073667200000001000000000000000000000000000000156266726100000001000000000000000000000000166D70657300000001000000000000000000000000002868617264000000010000000000000000000000000000000000000000000000000000000000000016656E647300000001000000000000000000000000001663666C67000000010000000000000000004400000018636D66720000000100000000000000004156494400000014636C757400000001000000000000000000000038636465630000000100000000000000004156494400000001000000020000000100000009000000030000000000000000000000000000001C766572730000000100000000000000000003001C000100000000001574726E6300000001000000000000000000000001066973697A00000001000000090000000000000018697764740000000100000000000000000000000000000018696867740000000100000000000000000000000000000018707764740000000100000000000000000000000000000018706867740000000100000000000000000000000000000034636C617000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000001C706173700000000100000000000000000000000000000000000000187363616D000000010000000000000000000000000000001564696E74000000010000000000000000000000001575656E66000000010000000000000000000000008C736F756E0000000100000005000000000000001873736374000000010000000000000000736F777400000018737372740000000100000000000000005622000000000016737373730000000100000000000000000010000000167373636300000001000000000000000000010000001C76657273000000010000000000000000000300140001000000000015656E76690000000100000000000000000100000015656E736F000000010000000000000000010000003F7361766500000001000000020000000000000015666173740000000100000000000000000100000016737374790000000100000000000000000001)");
			
		
		

	}	

}



