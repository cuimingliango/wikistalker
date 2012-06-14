<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- Edited by XMLSpy® -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:param name="treshold">0.745</xsl:param>
<xsl:param name="sortMethod">title</xsl:param>

<xsl:template match="outLinks">
	<LinkOuts>

	<xsl:for-each select="outLink">
		<xsl:sort select="@title[$sortMethod = 'title']"/>
		<xsl:sort select="@relatedness[$sortMethod = 'relatedness']" order="ascending"/>

		<!--<xsl:sort select="(*/*)[name()=$sortMethod]"/>
		<xsl:sort select="@title"/>-->
		<xsl:if test="@relatedness &gt; $treshold">
		<LinkOut>
			<title><xsl:value-of select="@title"/></title>
			<relatedness><xsl:value-of select="@relatedness"/></relatedness>
			<id><xsl:value-of select="@id"/></id>
		</LinkOut>
		</xsl:if>
		<!--<xsl:if test="title = $sortMethod">
			<xsl:sort select="@title"/>
		</xsl:if>-->

	</xsl:for-each>
	</LinkOuts>
</xsl:template>
<xsl:template match="inLinks">
	<LinkOuts>

	<xsl:for-each select="inLink">
		<xsl:sort select="@title[$sortMethod = 'title']"/>
		<xsl:sort select="@relatedness[$sortMethod = 'relatedness']" order="ascending"/>

		<xsl:if test="@relatedness &gt; $treshold">
		<LinkIn>
			<title><xsl:value-of select="@title"/></title>
			<relatedness><xsl:value-of select="@relatedness"/></relatedness>
			<id><xsl:value-of select="@id"/></id>
		</LinkIn>
		</xsl:if>

	</xsl:for-each>
	</LinkOuts>
</xsl:template>


	
	
<xsl:template match="message/parentCategories">
	<CategoryList>
		<xsl:copy-of select="parentCategory"/>
	</CategoryList>
</xsl:template>


</xsl:stylesheet>