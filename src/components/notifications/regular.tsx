export const RegularNotification = ({ ref }: any) => {
  return (
    <div
      className="relative bg-white text-black font-serif p-[20mm]"
      style={{ width: "210mm" }}
      ref={ref}
    >
      <div>
        <section className="max-w-none text-justify mb-6 space-y-4">
          <p>
            Em atenção ao Decreto Estadual nº. 1.387, de 25 de março de 2025,
            que “Estabelece diretrizes para a manutenção e conservação dos
            imóveis ocupados pelos órgãos e entidades da Administração Direta e
            Indireta do Poder Executivo do Estado de Mato Grosso, e dá outras
            providências”, que definiu que a SEPLAG, enquanto órgão central de
            patrimônio, é responsável pela orientação e fiscalização da execução
            de ações preventivas, de manutenção e conservação de bens imóveis
            públicos do Estado de Mato Grosso, sirvo-me do presente para
            NOTIFICAR o responsável pela guarda, manutenção e conservação do bem
            imóvel objeto do Relatório de Vistoria anexado ao final deste
            ofício.
          </p>

          <p>
            A ação foi conduzida nos termos do art. 5º, caput, do Decreto
            Estadual nº 1.387, de 2025, que atribuiu à SEPLAG a incumbência de
            orientar e fiscalizar a execução das ações pertinentes:
          </p>

          <blockquote className="border-l-2 pl-4 italic">
            “Art. 5º Compete à Secretaria de Estado de Planejamento e Gestão -
            SEPLAG, órgão central de patrimônio estadual, orientar e fiscalizar
            a execução das ações de prevenção, de manutenção e conservação dos
            imóveis dos órgãos e entidades do Poder Executivo do Estado de Mato
            Grosso”.
          </blockquote>

          <p>
            Durante a vistoria, procedeu-se à verificação do estado geral de
            conservação do imóvel, abrangendo aspectos estruturais, elétricos,
            hidráulicos, sanitários, condições de acessibilidade, segurança,
            limpeza, uso adequado e conservação de bens integrados ao imóvel.
          </p>

          <p>
            Ressaltamos que, nos termos do art. 3º do referido Decreto, compete
            a esse órgão/entidade a adoção de medidas voltadas à conservação e
            manutenção preventiva e corretiva do bem imóvel, garantindo sua
            funcionalidade, segurança, acessibilidade e sustentabilidade,
            observando ainda os prazos e requisitos normativos estabelecidos.
          </p>

          <p>
            Esta notificação tem caráter meramente informativo, para ciência e
            controle interno da unidade responsável, não implicando neste
            momento a fixação de prazos ou penalidades. Entretanto, recomendamos
            que as medidas necessárias para o aperfeiçoamento das condições do
            imóvel sejam avaliadas e programadas, especialmente em observância
            ao art. 4º do Decreto nº 1.387/2025:
          </p>

          <blockquote className="border-l-2 pl-4 italic">
            “Art. 4º O agente público responsável pela unidade administrativa
            deverá planejar e executar as atividades de conservação do imóvel,
            solicitando ao órgão ou entidade ao qual está vinculado os recursos
            financeiros necessários para a realização da manutenção, limpeza e
            conservação do imóvel, e após a execução, prestar contas e reportar
            as ocorrências que exijam a sua atuação.”
          </blockquote>

          <p>
            Reforçamos, por fim, que a SEPLAG permanecerá à disposição para
            prestar apoio técnico, sempre que necessário, com vistas à
            manutenção do padrão ora verificado, nos termos do art. 6º do
            Decreto nº 1.387/2025.
          </p>
          <p className="mt-6">Sendo o que tinha a informar.</p>
        </section>

        <section className="mb-6">
          <p className="font-medium">Atenciosamente,</p>
          <div className="mt-6 space-y-1">
            <p className="font-semibold">KAROL MARTIMIANO MASIERO</p>
            <p>SECRETÁRIO ADJUNTO</p>
            <p>GABINETE DO SECRETÁRIO ADJUNTO DE PATRIMONIO E SERVICOS</p>
          </div>
        </section>
      </div>
    </div>
  );
};
