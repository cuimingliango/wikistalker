<?php
  $xsl = new DomDocument;
  $xsl->load('wikiminer2.xsl');
  $xp = new XsltProcessor();
  // import the XSL styelsheet into the XSLT process
  $xp->importStylesheet($xsl);
  
  $xml_doc = new DomDocument;
  $xml_doc->load('http://wikipedia-miner.cms.waikato.ac.nz/services/exploreArticle?outLinks=true&parentCategories=true&linkRelatedness=true&title=Jorge Luis Borges');
  
 // echo $xml_doc;
 //echo $xml_doc->saveXml($xml_doc->documentElement);

  
 // echo '---------------------------------';
 
  $xp->setParameter('', 'treshold', '0.7');
  $xp->setParameter('', 'sortMethod', 'relatedness');
  
    // transform the XML into HTML using the XSL file
  if ($transformed = $xp->transformToXML($xml_doc)) {
      echo $transformed;
  } else {
      trigger_error('XSL transformation failed.', E_USER_ERROR);
  } // if 
  
  
  ?>
