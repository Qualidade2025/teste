/** =========================================================
 * Validação da Resposta (Qualidade)
 *  - classificarReincidencia(token, rncId, classificacao)
 * Dependências: _getSession_(token)
 * Planilhas: "Controle", "Log"
 * ========================================================= */

function registrarDataHoraValidacao(sh, row, dataHora) {
  var dt = dataHora instanceof Date ? dataHora : new Date();
  var cols = _getControleColumnIndices_(sh);
  var range = sh.getRange(row, cols.dataValidacaoResposta.column);
  range.setValue(dt);
  range.setNumberFormat('dd/MM/yyyy HH:mm');
}
/** Qualidade: classifica uma possível reincidência antes de validar a resposta. */
function classificarReincidencia(token, rncId, classificacao) {
  var sess = _getSession_(token);
  if (!_isQualidadeSession_(sess)) throw new Error('Somente a Qualidade pode classificar a reincidência.');

  rncId = String(rncId || '').trim();
  classificacao = String(classificacao || '').trim();
  if (!rncId) throw new Error('RNC inválida.');
  if (REINCIDENCIA_CLASSIFICACOES.indexOf(classificacao) === -1) throw new Error('Classificação de reincidência inválida.');

  var sh = SpreadsheetApp.getActive().getSheetByName('Controle');
  if (!sh) throw new Error('Aba "Controle" não encontrada.');
  var vals = sh.getDataRange().getValues();
  var cols = _getControleColumnIndices_(sh);

  for (var r = 1; r < vals.length; r++) {
    if (String(vals[r][cols.rnc.index] || '').trim() !== rncId) continue;
    var atual = String(vals[r][cols.reincidencia.index] || '').trim();
    if (atual !== REINCIDENCIA_POSSIVEL) throw new Error('Esta RNC não possui classificação de reincidência pendente.');
    sh.getRange(r + 1, cols.reincidencia.column).setValue(classificacao);
    return { ok: true, rncId: rncId, reincidencia: classificacao };
  }
  throw new Error('RNC não encontrada na aba Controle.');
}
