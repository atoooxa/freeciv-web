/**********************************************************************
    Freeciv-web - the web version of Freeciv. http://play.freeciv.org/
    Copyright (C) 2009-2015  The Freeciv-web project

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

***********************************************************************/


var requirements = {};


/* Range of requirements.
 * Used in the network protocol.
 * Order is important -- wider ranges should come later -- some code
 * assumes a total order, or tests for e.g. >= REQ_RANGE_PLAYER.
 * Ranges of similar types should be supersets, for example:
 *  - the set of Adjacent tiles contains the set of CAdjacent tiles,
 *    and both contain the center Local tile (a requirement on the local
 *    tile is also within Adjacent range);
 *  - World contains Alliance contains Player (a requirement we ourselves
 *    have is also within Alliance range). */
var REQ_RANGE_LOCAL = 0;
var REQ_RANGE_CADJACENT = 1;
var REQ_RANGE_ADJACENT = 2;
var REQ_RANGE_CITY = 3;
var REQ_RANGE_TRADEROUTE = 4;
var REQ_RANGE_CONTINENT = 5;
var REQ_RANGE_PLAYER = 6;
var REQ_RANGE_TEAM = 7;
var REQ_RANGE_ALLIANCE = 8;
var REQ_RANGE_WORLD = 9;
var REQ_RANGE_COUNT = 10;   /* keep this last */


/****************************************************************************
  Checks the requirement to see if it is active on the given target.

  target gives the type of the target
  (player,city,building,tile) give the exact target
  req gives the requirement itself

  Make sure you give all aspects of the target when calling this function:
  for instance if you have TARGET_CITY pass the city's owner as the target
  player as well as the city itself as the target city.
****************************************************************************/
function is_req_active(target_player,
		   target_city,
		   target_building,
		   target_tile,
		   target_unittype,
		   target_output,
		   target_specialist,
		   req,
           prob_type)
{
  var eval = false;

  /* Note the target may actually not exist.  In particular, effects that
   * have a VUT_SPECIAL or VUT_TERRAIN may often be passed to this function
   * with a city as their target.  In this case the requirement is simply
   * not met. */
  switch (req['kind']) {
  case VUT_NONE:
    eval = true;
    break;
  case VUT_ADVANCE:
    /* The requirement is filled if the player owns the tech. */
    eval = is_tech_in_range(target_player, req['range'], req['value']);
    break;
  case VUT_GOVERNMENT:
    /* The requirement is filled if the player is using the government. */
    //FIXME: implement
    //eval = (government_of_player(target_player) == req->source.value.govern);

    break;
  case VUT_IMPROVEMENT:
    /* The requirement is filled if there's at least one of the building
     * in the city.  (This is a slightly nonstandard use of
     * count_sources_in_range.) */
     //FIXME: implement
    /*eval = (count_buildings_in_range(target_player, target_city,
				     target_building,
				     req->range, req->survives,
				     req->source.value.building) > 0);*/
    break;
  case VUT_TERRAIN:
    //FIXME: implement
    /*eval = is_terrain_in_range(target_tile,
			       req->range, req->survives,
			       req->source.value.terrain);*/
    break;
  case VUT_NATION:
    //FIXME: implement
    /*eval = is_nation_in_range(target_player, req->range, req->survives,
			      req->source.value.nation);*/
    break;
  case VUT_UTYPE:
    //FIXME: implement
    /*eval = is_unittype_in_range(target_unittype,
				req->range, req->survives,
				req->source.value.utype);*/
    break;
  case VUT_UTFLAG:
    //FIXME: implement
    /*eval = is_unitflag_in_range(target_unittype,
				req->range, req->survives,
				req->source.value.unitflag,
                                prob_type);*/
    break;
  case VUT_UCLASS:
    //FIXME: implement
    /*eval = is_unitclass_in_range(target_unittype,
				 req->range, req->survives,
				 req->source.value.uclass);*/
    break;
  case VUT_UCFLAG:
    //FIXME: implement
    /*eval = is_unitclassflag_in_range(target_unittype,
				     req->range, req->survives,
				     req->source.value.unitclassflag);*/
    break;
  case VUT_OTYPE:
    //FIXME: implement
    /*eval = (target_output
	    && target_output->index == req->source.value.outputtype);*/
    break;
  case VUT_SPECIALIST:
    //FIXME: implement
    /*eval = (target_specialist
	    && target_specialist == req->source.value.specialist);*/
    break;
  case VUT_MINSIZE:
    //FIXME: implement
    /* eval = target_city && target_city->size >= req->source.value.minsize;*/
    break;
  case VUT_AI_LEVEL:
      //FIXME: implement
      /*eval = target_player
      && target_player->ai_data.control
      && target_player->ai_data.skill_level == req->source.value.ai_level;*/
    break;
  case VUT_TERRAINCLASS:
    //FIXME: implement
    /*eval = is_terrain_class_in_range(target_tile,
                                     req->range, req->survives,
                                     req->source.value.terrainclass);*/
    break;
  case VUT_MINYEAR:
    //FIXME: implement
    /* eval = game.info.year >= req->source.value.minyear; */
    break;
  case VUT_TERRAINALTER:
    //FIXME: implement
    /*eval = is_terrain_alter_possible_in_range(target_tile,
                                              req->range, req->survives,
                                              req->source.value.terrainalter);*/
    break;
  case VUT_CITYTILE:
    //FIXME: implement
    /*if (target_tile) {
      if (req->source.value.citytile == CITYT_CENTER) {
        if (target_city) {
          eval = is_city_center(target_city, target_tile);
        } else {
          eval = tile_city(target_tile) != NULL;
        }
      } else {
         Not implemented
        assert(FALSE);
      }
    } else {
      eval = FALSE;
    }*/
    break;
  case VUT_LAST:
    return false;
  }

  if (req['negated'] == true) {
    return !eval;
  } else {
    return eval;
  }
}


/****************************************************************************
  Checks the requirement(s) to see if they are active on the given target.

  target gives the type of the target
  (player,city,building,tile) give the exact target

  reqs gives the requirement vector.
  The function returns TRUE only if all requirements are active.

  Make sure you give all aspects of the target when calling this function:
  for instance if you have TARGET_CITY pass the city's owner as the target
  player as well as the city itself as the target city.
****************************************************************************/
function are_reqs_active(target_player,
		     target_city,
		     target_building,
		     target_tile,
		     target_unittype,
		     target_output,
		     target_specialist,
		     reqs,
             prob_type)
{

  for (var i = 0; i < reqs.length; i++) {
    if (!is_req_active(target_player, target_city, target_building,
		       target_tile, target_unittype, target_output,
		       target_specialist,
		       reqs[i], prob_type)) {
      return false;
    }
  }
  return true;
}


/****************************************************************************
  Is there a source tech within range of the target?
****************************************************************************/
function is_tech_in_range(target_player, range, tech)
{
  switch (range) {
  case REQ_RANGE_PLAYER:
    return (target_player != null
	    && player_invention_state(target_player, tech) == TECH_KNOWN);
  case REQ_RANGE_TEAM:
  case REQ_RANGE_ALLIANCE:
      /* FIXME: Add support. */
      return false;
  case REQ_RANGE_WORLD:
    // FIXME! Add support for global advances.
    return false;
    //return game.info.global_advances[tech];
  case REQ_RANGE_LOCAL:
  case REQ_RANGE_CADJACENT:
  case REQ_RANGE_ADJACENT:
  case REQ_RANGE_CITY:
  case REQ_RANGE_TRADEROUTE:
  case REQ_RANGE_CONTINENT:
  case REQ_RANGE_COUNT:
    break;
  }
  return false;
}


/**************************************************************************
  Return the number of shields it takes to build this universal.
**************************************************************************/
function universal_build_shield_cost(target)
{
  return target['build_cost'];
}
